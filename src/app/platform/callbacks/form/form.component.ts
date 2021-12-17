import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { CallbackService } from 'src/app/_shared/services/http/callback.service';
import { HelpersService } from 'src/app/_shared/services/generic/helpers.service';

import { ErrorMessages } from 'src/app/_shared/constants/error-messages';
import { SelectItemModel } from 'src/app/_shared/models/select-item.model';
import { CallbackTextModel, CallbackTextTypes } from 'src/app/_shared/models/callback-text.model';

@Component({
	selector: 'app-form',
	templateUrl: './form.component.html'
})
export class FormComponent implements OnInit {

	readonly errorMessages = ErrorMessages;

  readonly callbackTextTypes = CallbackTextTypes;

  readonly tabs = [
    { label: 'general', value: 'general' },
    { label: 'request_handling_settings', value: 'request' },
    { label: 'texts', value: 'texts' }
  ];

  activeTab = 'general';

	callbackForm: FormGroup;

  callbackId: number;

  audioFile: File;

  schedules: SelectItemModel[] = [];

	isSubmitting = false;

	constructor(private router: Router, private route: ActivatedRoute,
              private fb: FormBuilder, private callbackService: CallbackService,
              private helpers: HelpersService) {}

	ngOnInit(): void {
    this.makeForm();

    const routeData = this.route.snapshot.data;
    this.schedules = routeData.schedules;

    if (routeData.callback) {
      this.callbackId = routeData.callback.id;
      const data = { ...routeData.callback };
      delete data.texts;
      this.callbackForm.patchValue(data);
      if (routeData.callback.file) {
        this.audioFile = this.helpers.base64toFile(routeData.callback.file, routeData.callback.fileName);
      }

      this.setTextArray(routeData.callback.texts);
    }
	}

  private makeForm(): void {
    this.callbackForm = this.fb.group({
      name: this.fb.control(null, Validators.required),
      description: this.fb.control(null),
      requestDuration: this.fb.control(0),
      dialAttempts: this.fb.control(0),
      enableDialer: this.fb.control(false),
      schedule: this.fb.control(null, Validators.required),
      answerCalculation: this.fb.control(0),
      dialAttemptIntervals: this.fb.control(0),
      mailCallback: this.fb.control(false),
      file: this.fb.control(null),
      fileName: this.fb.control(null),
      texts: this.fb.array([])
    });

    const textArray = (this.callbackForm.get('texts') as FormArray);
    this.callbackTextTypes.forEach(type => {
     const group = this.fb.group({
       type: this.fb.control(type),
       content: this.fb.control({ value: null, disabled: true }),
       isActive: this.fb.control(null)
     });

      textArray.push(group);
    });
  }

  private setTextArray(texts: CallbackTextModel[]): void {
    const textArray = (this.callbackForm.get('texts') as FormArray);
    textArray.controls.forEach(control => {
      const text = texts.find(text => text.type === control.get('type').value);
      if (text) {
        control.patchValue(text);
        control.get('isActive').value ? control.get('content').enable() : null;
      }
    });
  }

  setFile(file?: { bin: string, name: string }): void {
    this.callbackForm.get('file').patchValue(file ? file.bin : null);
    this.callbackForm.get('fileName').patchValue(file ? file.name : null);
  }

  setTextDisabledState(index: number): void {
    const control = (this.callbackForm.get('texts') as FormArray).at(index).get('content');
    control.disabled ? control.enable() : control.disable();
  }

	submit(): void {
    if (this.callbackForm.invalid) {
      this.toggleInvalidTabs();
    }

		if (this.callbackForm.valid && !this.isSubmitting) {
      const values = this.callbackForm.value;
      values.texts = this.filterEmptyTexts();

			this.isSubmitting = true;

			if (this.callbackId) {
				this.callbackService.updateCallback(this.callbackId, values).then(response => {
          this.handleServerResponse(response);
        });
			} else {
				this.callbackService.newCallback(this.callbackForm.value).then(response => {
          this.handleServerResponse(response);
        });
			}
		}
	}

  private filterEmptyTexts(): object[] {
    const values = [];

    const textArray = (this.callbackForm.get('texts') as FormArray);
    textArray.getRawValue().forEach(text => {
      if (text.content) {
        values.push(text);
      }
    });

    return values;
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
