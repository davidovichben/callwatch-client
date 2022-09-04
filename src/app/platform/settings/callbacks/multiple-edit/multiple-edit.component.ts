import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { CallbackService } from 'src/app/_shared/services/http/callback.service';

import { SelectItemModel } from 'src/app/_shared/models/select-item.model';
import { CallbackModel } from 'src/app/_shared/models/callback.model';
import { isInteger } from 'src/app/_shared/validators/integer.validator';
import { ErrorMessages } from 'src/app/_shared/constants/error-messages';

@Component({
  selector: 'app-multiple-edit',
  templateUrl: './multiple-edit.component.html'
})
export class MultipleEditComponent {

  readonly errorMessages = ErrorMessages;

  readonly optionalDialerControls = ['schedule', 'dialAttemptIntervals', 'dialAttempts', 'minDigitsForRequest'];

  formGroup: FormGroup;

  checkedItems: CallbackModel[]

  schedules: SelectItemModel[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder,
              private dialogRef: MatDialogRef<MultipleEditComponent>,
              private callbackService: CallbackService) {}

  ngOnInit(): void {
    this.checkedItems = this.data.checkedItems;
    this.schedules = this.data.schedules;

    this.formGroup = this.fb.group({
      requestDuration: this.fb.control(null, isInteger),
      enableDialer: this.fb.control(null),
      answerCalculation: this.fb.control(null, isInteger),
      schedule: this.fb.control({ value: null, disabled: true }),
      dialAttempts: this.fb.control({ value: null, disabled: true }, isInteger),
      dialAttemptIntervals: this.fb.control({ value: null, disabled: true }, isInteger),
      minDigitsForRequest: this.fb.control({ value: 7, disabled: true }, isInteger),
      mailCallback: this.fb.control(null),
      overrideWithNull: this.fb.control(null)
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

  submit(): void {
    if (this.formGroup.valid) {
      this.callbackService.multipleUpdate(this.checkedItems, this.formGroup.value).then(response => this.dialogRef.close(response));
    }
  }
}
