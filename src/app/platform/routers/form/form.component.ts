import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { AudioInputComponent } from 'src/app/_shared/components/audio-input/audio-input.component';

import { RouterService } from 'src/app/_shared/services/http/router.service';

import { RouterModel } from 'src/app/_shared/models/router.model';
import { ErrorMessages } from 'src/app/_shared/constants/error-messages';
import { SelectItemModel } from 'src/app/_shared/models/select-item.model';

@Component({
	selector: 'app-form',
	templateUrl: './form.component.html'
})
export class FormComponent implements OnInit, OnDestroy {

  @ViewChild(AudioInputComponent) audioInput: AudioInputComponent;

  readonly sub = new Subscription();

	readonly errorMessages = ErrorMessages;

  schedules: SelectItemModel[] = [];

  activeTab = 'general';

  routerForm: FormGroup;

	routerModel: RouterModel;

	isSubmitting = false;

  audioFile: File;

  constructor(private router: Router, private route: ActivatedRoute,
              private fb: FormBuilder, private routerService: RouterService) {}

	ngOnInit(): void {
    this.makeForm();
    this.setFormSubscriptions();

		const routeData = this.route.snapshot.data;
    this.schedules = routeData.schedules;

    if (routeData.router) {
      this.routerModel = routeData.router;
      this.routerForm.patchValue(routeData.router);
    }
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

  private setFormSubscriptions(): void {
    const controlNames = {
      irregularTimingEnabled: ['irregularTimingActive', 'irregularTimingFrom', 'irregularTimingTo'],
      vipEnabled: ['vipDestination'],
      waitingRouterEnabled: ['queuePositionReading', 'queueWaitingTime']
    };

    Object.keys(controlNames).forEach(controlName => {
      const sub = this.routerForm.get('general.' + controlName).valueChanges.subscribe(value => {
        controlNames[controlName].forEach(controlName => {
          const control = this.routerForm.get('general.' + controlName);
          value ? control.enable() : control.disable();
        });

        if (controlName === 'hasWaitingRouter') {
          this.audioInput.disabled = !value;
        }
      })

      this.sub.add(sub);
    });
  }

  setFile(file?: { bin: string, name: string }): void {
    this.routerForm.get('queueFile').patchValue(file ? file.bin : null);
    this.routerForm.get('queueFileName').patchValue(file ? file.name : null);
  }

	submit(): void {
		if (this.routerForm.valid && !this.isSubmitting) {
			this.isSubmitting = true;

      const values = {};
      Object.keys(this.routerForm.value).forEach(groupName => {
        Object.assign(values, this.routerForm.getRawValue()[groupName]);
      })

			if (this.routerModel.id) {
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
