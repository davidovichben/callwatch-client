import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { AudioInputComponent } from 'src/app/_shared/components/audio-input/audio-input.component';

import { RouterFormService } from 'src/app/_shared/services/state/router-form.service';
import { GenericService } from 'src/app/_shared/services/http/generic.service';

import { ErrorMessages } from 'src/app/_shared/constants/error-messages';
import { isDateGreaterOrEqual } from 'src/app/_shared/validators/date-greater-equal.validator';
import { isInteger } from 'src/app/_shared/validators/integer.validator';

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html'
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

  audioFile: { bin: string, name: string };

  routerForm: FormGroup;

  constructor(private fb: FormBuilder, public formService: RouterFormService,
              private genericService: GenericService) {}

  ngOnInit(): void {
    this.makeForm();

    this.routerForm = (this.formService.routerForm.get('general') as FormGroup);

    const router = this.formService.router;
    if (router) {
      if (router.general.queueFile) {
        this.audioFile = { bin: router.general.queueFile, name: router.general.queueFileName };
      }

      this.formService.routerForm.get('general').patchValue(router.general);
    }
  }

  private makeForm(): void {
    this.formService.routerForm.setControl('general', this.fb.group({
      name: this.fb.control(null, Validators.required, this.checkNameExists.bind(this)),
      tags: this.fb.control(null),
      description: this.fb.control(null),
      schedule: this.fb.control(null),
      irregularTimingEnabled: this.fb.control(null),
      irregularTimingActive: this.fb.control({ value: null, disabled: true }),
      irregularTimingFrom: this.fb.control({ value: null, disabled: true }),
      irregularTimingTo: this.fb.control({ value: null, disabled: true }),
      dialedNumbers: this.fb.control(null),
      adminCode: this.fb.control(null),
      defaultSelectionDuration: this.fb.control(4, isInteger.bind(this)),
      vipEnabled: this.fb.control(null),
      vipDestination: this.fb.control({ value: null, disabled: true }),
      waitingRouterEnabled: this.fb.control(null),
      queuePositionReading: this.fb.control({ value: null, disabled: true }),
      queueWaitingTime: this.fb.control({ value: null, disabled: true }, isInteger),
      queueFile: this.fb.control(null),
      queueFileName: this.fb.control(null)
    }));
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.setToggledControls(), 0);
    this.setFormSubscriptions();
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

  checkNameExists(control: FormControl): Promise<object> {
    if (this.formService.router && this.formService.router.general.name === control.value) {
      return Promise.resolve(null);
    }

    return this.genericService.exists('router', control.value).then(response => {
      if (response) {
        return response.exists ? { exists: true } : null;
      }

      return null;
    })
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
