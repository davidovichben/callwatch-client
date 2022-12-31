import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormGroup, Validators } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { Subscription } from 'rxjs';

import { AudioInputComponent } from 'src/app/_shared/components/audio-input/audio-input.component';

import { RouterFormService } from 'src/app/_shared/services/state/router-form.service';

import { ErrorMessages } from 'src/app/_shared/constants/error-messages';
import { isDateGreaterOrEqual } from 'src/app/_shared/validators/date-greater-equal.validator';
import { Fade } from 'src/app/_shared/constants/animations';

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  animations: [Fade]
})
export class GeneralComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild(AudioInputComponent) audioInput: AudioInputComponent;

  readonly sub = new Subscription();

  readonly errorMessages = ErrorMessages;

  readonly toggledControls = {
    irregularTimingEnabled: ['irregularTimingActive', 'irregularTimingFrom', 'irregularTimingTo'],
    vipEnabled: ['vipDestination'],
    waitingRouterEnabled: ['queuePositionReading', 'queueWaitingTime']
  };

  languages = [];

  audioFile: { bin: string, name: string };

  routerForm: FormGroup;

  constructor(public formService: RouterFormService, private dateAdapter: DateAdapter<Date>) {
      // this.dateAdapter.setLocale('es');
  }

  ngOnInit(): void {
    this.routerForm = (this.formService.routerForm.get('general') as FormGroup);
    this.formService.activeGroup = 'general';
    this.languages = this.formService.languages;

    const router = this.formService.router;
    if (router) {
      if (router.general.queueFile) {
        this.audioFile = { bin: router.general.queueFile, name: router.general.queueFileName };
      }
    }

    if (this.routerForm.get('dialedNumbers').value.length === 0) {
      this.formService.addDialNumberGroup();
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.setToggledControls(), 0);
    this.setFormSubscriptions();
    this.setDisabledLanguages();
  }

  private setToggledControls(): void {
    Object.keys(this.toggledControls).forEach(toggleName => {
      this.toggleControls(toggleName);
    });
  }

  private setFormSubscriptions(): void {
    Object.keys(this.toggledControls).forEach(toggleName => {
      const sub = this.routerForm.get(toggleName).valueChanges.subscribe(() => {
        this.toggleControls(toggleName);
      })

      this.sub.add(sub);
    });
  }

  removeDialedNumbersGroup(index: number): void {
    (this.routerForm.get('dialedNumbers') as FormArray).removeAt(index);
    this.setDisabledLanguages();
  }

  numbersChange(numbers: string[], index: number): void {
    const validators = numbers && numbers.length > 0 ? Validators.required : [];
    this.routerForm.get('dialedNumbers.' + index + '.language').setValidators(validators);
  }

  setDisabledLanguages(): void {
    const numberGroups = this.routerForm.get('dialedNumbers').value;
    this.languages.forEach(language => {
      language.disabled = !!numberGroups.find(group => group.language === language.id);
    });
  }

  private toggleControls(toggleName: string): void {
    const toggled = this.routerForm.get(toggleName).value;

    this.toggledControls[toggleName].forEach(controlName => {
      const control = this.routerForm.get(controlName);
      toggled ? control.enable() : control.disable();
    });

    if (toggleName === 'irregularTimingEnabled') {
      const minControl = this.formService.routerForm.get('general.irregularTimingFrom');
      const validators = isDateGreaterOrEqual.bind(this, { minControl, unitOfTime: 'seconds' });
      this.formService.routerForm.get('general.irregularTimingTo').setValidators(validators);
    }

    if (toggleName === 'waitingRouterEnabled') {
      this.audioInput.disabled = !toggled;
    }
  }

  setFile(file?: { bin: string, name: string }): void {
    this.routerForm.get('queueFile').patchValue(file ? file.bin : null);
    this.routerForm.get('queueFileName').patchValue(file ? file.name : null);
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
