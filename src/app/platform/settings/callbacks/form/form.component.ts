import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { CallbackService } from 'src/app/_shared/services/http/callback.service';
import { HelpersService } from 'src/app/_shared/services/generic/helpers.service';

import { ErrorMessages } from 'src/app/_shared/constants/error-messages';
import { SelectItemModel } from 'src/app/_shared/models/select-item.model';
import { CallbackTextModel, CallbackTextTypes } from 'src/app/_shared/models/callback-text.model';
import { isInteger } from 'src/app/_shared/validators/integer.validator';
import { CallbackModel } from 'src/app/_shared/models/callback.model';

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

  readonly optionalDialerControls = ['schedule', 'dialAttemptIntervals', 'dialAttempts', 'minDigitsForRequest'];

  activeTab = 'general';

	formGroup: FormGroup;

  callbackId: number;

  audioFile: { bin: string | Blob, name: string };

  schedules: SelectItemModel[] = [];

	isSubmitting = false;

	constructor(private router: Router, private route: ActivatedRoute,
              private fb: FormBuilder, private callbackService: CallbackService) {}

	ngOnInit(): void {
    this.makeForm();

    const routeData = this.route.snapshot.data;
    this.schedules = routeData.schedules;

    if (routeData.callback) {
      this.patchData(routeData.callback);
    }
	}

  private makeForm(): void {
    this.formGroup = this.fb.group({
      name: this.fb.control(null, Validators.required),
      description: this.fb.control(null),
      requestDuration: this.fb.control(null, isInteger),
      enableDialer: this.fb.control(null),
      answerCalculation: this.fb.control(null, isInteger),
      schedule: this.fb.control({ value: null, disabled: true }),
      dialAttempts: this.fb.control({ value: null, disabled: true }, isInteger),
      dialAttemptIntervals: this.fb.control({ value: null, disabled: true }, isInteger),
      minDigitsForRequest: this.fb.control({ value: 7, disabled: true }, isInteger),
      mailCallback: this.fb.control(null),
      file: this.fb.control(null),
      fileName: this.fb.control(null),
      texts: this.fb.array([])
    });

    const textArray = (this.formGroup.get('texts') as FormArray);
    this.callbackTextTypes.forEach(type => {
     const group = this.fb.group({
       type: this.fb.control(type),
       content: this.fb.control({ value: null, disabled: true }),
       isActive: this.fb.control(null)
     });

      textArray.push(group);
    });
  }

  private patchData(callback: CallbackModel): void {
    this.callbackId = callback.id;
    const data = { ...callback };
    delete data.texts;
    this.formGroup.patchValue(data);

    if (data.file) {
      this.audioFile = { bin: data.file, name: data.fileName };
    }

    if (this.formGroup.get('enableDialer').value) {
      this.enableDialerChecked(true);
    }

    this.setTextArray(callback.texts);
  }

  private setTextArray(texts: CallbackTextModel[]): void {
    const textArray = (this.formGroup.get('texts') as FormArray);
    textArray.controls.forEach(control => {
      const text = texts.find(text => text.type === control.get('type').value);
      if (text) {
        control.patchValue(text);
        control.get('isActive').value ? control.get('content').enable() : null;
      }
    });
  }

  enableDialerChecked(checked: boolean): void {
    this.optionalDialerControls.forEach(controlName => {
      const control = this.formGroup.get(controlName);
      checked ? control.enable() : control.disable();
    })

    const validators = checked ? Validators.required : null;
    this.formGroup.get('schedule').setValidators(validators);
  }

  setFile(file?: { bin: string, name: string }): void {
    this.formGroup.get('file').patchValue(file ? file.bin : null);
    this.formGroup.get('fileName').patchValue(file ? file.name : null);
  }

  setTextDisabledState(index: number): void {
    const control = (this.formGroup.get('texts') as FormArray).at(index).get('content');
    control.disabled ? control.enable() : control.disable();
  }

	submit(): void {
    if (this.formGroup.invalid) {
      this.toggleInvalidTabs();
    }

		if (this.formGroup.valid && !this.isSubmitting) {
      const values = this.formGroup.getRawValue();
      values.texts = this.filterEmptyTexts();

			this.isSubmitting = true;

			if (this.callbackId) {
				this.callbackService.updateCallback(this.callbackId, values).then(response => {
          this.handleServerResponse(response);
        });
			} else {
				this.callbackService.newCallback(values).then(response => {
          this.handleServerResponse(response);
        });
			}
		}
	}

  private filterEmptyTexts(): object[] {
    const values = [];

    const textArray = (this.formGroup.get('texts') as FormArray);
    textArray.getRawValue().forEach(text => {
      if (text.content) {
        values.push(text);
      }
    });

    return values;
  }

  private toggleInvalidTabs(): void {
    if (this.formGroup.get('name').invalid) {
      this.activeTab = 'general';
      return;
    }

    if (this.formGroup.get('schedule').invalid) {
      this.activeTab = 'request';
    }
  }

	private handleServerResponse(response: boolean): void {
		if (response) {
			this.router.navigate(['/platform', 'settings', 'callbacks']);
		} else {
      this.isSubmitting = false;
    }
	}
}
