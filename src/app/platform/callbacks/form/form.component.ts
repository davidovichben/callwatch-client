import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { CallbackService } from 'src/app/_shared/services/http/callback.service';
import { HelpersService } from 'src/app/_shared/services/generic/helpers.service';

import { ErrorMessages } from 'src/app/_shared/constants/error-messages';
import { SelectItemModel } from 'src/app/_shared/models/select-item.model';

@Component({
	selector: 'app-form',
	templateUrl: './form.component.html'
})
export class FormComponent implements OnInit {

	readonly errorMessages = ErrorMessages;

  activeTab = 'general';

	callbackForm: FormGroup;

  callbackId: number;

  audioFile: File;

  schedules: SelectItemModel[] = [];
  textControlNames = [];

	isSubmitting = false;

	constructor(private router: Router, private route: ActivatedRoute,
              private fb: FormBuilder, private callbackService: CallbackService,
              private helpers: HelpersService) {}

	ngOnInit(): void {
    this.makeForm();

    const textControls = (this.callbackForm.get('texts') as FormGroup).controls;
    this.textControlNames = Object.keys(textControls);

    const routeData = this.route.snapshot.data;
    this.schedules = routeData.schedules;

    if (routeData.callback) {
      this.callbackId = routeData.callback.id;
      this.callbackForm.patchValue(routeData.callback);
      if (routeData.callback.file) {
        this.audioFile = this.helpers.base64toFile(routeData.callback.file, routeData.callback.fileName);
      }

      const textControls = (this.callbackForm.get('texts') as FormGroup).controls;
      Object.keys(textControls).forEach(controlName => {
        textControls[controlName].value ? textControls[controlName].enable() : null
      });
    }
	}

  private makeForm(): void {
    this.callbackForm = this.fb.group({
      name: this.fb.control(null, Validators.required),
      description: this.fb.control(null),
      requestDuration: this.fb.control(null),
      dialAttempts: this.fb.control(null),
      enableDialer: this.fb.control(null),
      schedule: this.fb.control(null, Validators.required),
      answerCalculation: this.fb.control(null),
      dialAttemptIntervals: this.fb.control(null),
      mailCallback: this.fb.control(null),
      file: this.fb.control(null),
      fileName: this.fb.control(null),
      texts: this.fb.group({
        messageMaxRetries: this.fb.control({ value: null, disabled: true }),
        messageCompleted: this.fb.control({ value: null, disabled: true }),
        messageLeave: this.fb.control({ value: null, disabled: true }),
        customerReturn: this.fb.control({ value: null, disabled: true }),
        notHandled: this.fb.control({ value: null, disabled: true }),
        outOfSchedule: this.fb.control({ value: null, disabled: true }),
        leftOpen: this.fb.control({ value: null, disabled: true })
      })
    });
  }

  setFile(file?: { bin: string, name: string }): void {
    this.callbackForm.get('file').patchValue(file ? file.bin : null);
    this.callbackForm.get('fileName').patchValue(file ? file.name : null);
  }

  setTextDisabledState(controlName: string): void {
    const control = this.callbackForm.get('texts.' + controlName);
    if (control.disabled) {
      control.enable();
    } else {
      control.reset();
      control.disable();
    }
  }

	submit(): void {
    if (this.callbackForm.invalid) {
      this.toggleInvalidTabs();
    }


		if (this.callbackForm.valid && !this.isSubmitting) {
			this.isSubmitting = true;

			if (this.callbackId) {
				this.callbackService.updateCallback(this.callbackId, this.callbackForm.value).then(response => {
          this.handleServerResponse(response);
        });
			} else {
				this.callbackService.newCallback(this.callbackForm.value).then(response => {
          this.handleServerResponse(response);
        });
			}
		}
	}

  private toggleInvalidTabs(): void {
    if (this.callbackForm.get('name').invalid) {
      this.activeTab = 'general';
      return;
    }

    if (this.callbackForm.get('schedule').invalid) {
      this.activeTab = 'request';
    }
  }

	private handleServerResponse(response: boolean): void {
		if (response) {
			this.router.navigate(['/platform', 'callbacks']);
		}

		this.isSubmitting = false;
	}
}
