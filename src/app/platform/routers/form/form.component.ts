import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { AudioInputComponent } from 'src/app/_shared/components/audio-input/audio-input.component';

import { RouterService } from 'src/app/_shared/services/http/router.service';
import { HelpersService } from 'src/app/_shared/services/generic/helpers.service';

import { RouterModel } from 'src/app/_shared/models/router.model';
import { ErrorMessages } from 'src/app/_shared/constants/error-messages';
import { SelectItemModel } from 'src/app/_shared/models/select-item.model';

@Component({
	selector: 'app-form',
	templateUrl: './form.component.html'
})
export class FormComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild(AudioInputComponent) audioInput: AudioInputComponent;

  readonly sub = new Subscription();

	readonly errorMessages = ErrorMessages;

  readonly toggledControls = {
    irregularTimingEnabled: ['irregularTimingActive', 'irregularTimingFrom', 'irregularTimingTo'],
    vipEnabled: ['vipDestination'],
    waitingRouterEnabled: ['queuePositionReading', 'queueWaitingTime']
  };

  schedules: SelectItemModel[] = [];

  activeTab = 'general';

  routerForm: FormGroup;

	routerModel: RouterModel;

	isSubmitting = false;

  audioFile: File;

  constructor(private router: Router, private route: ActivatedRoute,
              private fb: FormBuilder, private routerService: RouterService,
              private helpers: HelpersService) {}

	ngOnInit(): void {
    this.makeForm();

		const routeData = this.route.snapshot.data;
    this.schedules = routeData.schedules;

    if (routeData.router) {
      this.routerModel = routeData.router;
      this.routerForm.patchValue(routeData.router);

      if (routeData.router.general.queueFile) {
        this.audioFile = this.helpers.base64toFile(routeData.router.general.queueFile, routeData.router.general.queueFileName);
      }
    }
	}

  ngAfterViewInit(): void {
    setTimeout(() => this.setToggledControls(), 0);
    this.setFormSubscriptions();
  }

  private makeForm(): void {
    this.routerForm = this.fb.group({
      general: this.fb.group({
        name: this.fb.control(null, Validators.required),
        description: this.fb.control(null),
        schedule: this.fb.control(null),
        irregularTimingEnabled: this.fb.control(null),
        irregularTimingActive: this.fb.control({ value: null, disabled: true }),
        irregularTimingFrom: this.fb.control({ value: null, disabled: true }),
        irregularTimingTo: this.fb.control({ value: null, disabled: true }),
        dialedNumbers: this.fb.control(null),
        adminCode: this.fb.control(null),
        defaultSelectionDuration: this.fb.control(null),
        vipEnabled: this.fb.control(null),
        vipDestination: this.fb.control({ value: null, disabled: true }),
        waitingRouterEnabled: this.fb.control(null),
        queuePositionReading: this.fb.control({ value: null, disabled: true }),
        queueWaitingTime: this.fb.control({ value: null, disabled: true }),
        queueFile: this.fb.control(null),
        queueFileName: this.fb.control(null)
      })
    });
  }

  private setToggledControls(): void {
    Object.keys(this.toggledControls).forEach(toggleName => {
      this.toggleControls(toggleName);
    });
  }

  private setFormSubscriptions(): void {
    Object.keys(this.toggledControls).forEach(toggleName => {
      const sub = this.routerForm.get('general.' + toggleName).valueChanges.subscribe(() => {
        this.toggleControls(toggleName);
      })

      this.sub.add(sub);
    });
  }

  private toggleControls(toggleName: string): void {
    const toggled = this.routerForm.get('general.' + toggleName).value;

    this.toggledControls[toggleName].forEach(controlName => {
      const control = this.routerForm.get('general.' + controlName);
      toggled ? control.enable() : control.disable();
    });

    if (toggleName === 'waitingRouterEnabled') {
      this.audioInput.disabled = !toggled;
    }
  }

  setFile(file?: { bin: string, name: string }): void {
    this.routerForm.get('general.queueFile').patchValue(file ? file.bin : null);
    this.routerForm.get('general.queueFileName').patchValue(file ? file.name : null);
  }

	submit(): void {
		if (this.routerForm.valid && !this.isSubmitting) {
			this.isSubmitting = true;

      const values = {};
      Object.keys(this.routerForm.value).forEach(groupName => {
        Object.assign(values, this.routerForm.getRawValue()[groupName]);
      })

			if (this.routerModel) {
				this.routerService.updateRouter(this.routerModel.id, values).then(response => this.handleServerResponse(response));
			} else {
				this.routerService.newRouter(values).then(response => this.handleServerResponse(response));
			}
		}
	}

	private handleServerResponse(response: boolean): void {
		if (response) {
			this.router.navigate(['/platform', 'routers']);
		}

		this.isSubmitting = false;
	}

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
