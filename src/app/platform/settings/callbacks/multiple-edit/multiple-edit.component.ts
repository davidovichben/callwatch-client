import { Component, Inject } from '@angular/core';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

import { CallbackService } from 'src/app/_shared/services/http/callback.service';

import { SelectItemModel } from 'src/app/_shared/models/select-item.model';
import { ErrorMessages } from 'src/app/_shared/constants/error-messages';
import { isInteger } from 'src/app/_shared/validators/integer.validator';

@Component({
  selector: 'app-multiple-edit',
  templateUrl: './multiple-edit.component.html',
  styleUrls: ['../../../../_shared/components/multiple-edit/multiple-edit.component.styl']
})
export class MultipleEditComponent {

  readonly errorMessages = ErrorMessages;

  readonly optionalDialerControls = ['schedule', 'dialAttemptIntervals', 'dialAttempts', 'minDigitsForRequest'];

  formGroup: UntypedFormGroup;

  checkedItems: any[]

  schedules: SelectItemModel[] = [];

  isSubmitting = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private fb: UntypedFormBuilder,
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
      forceEmpty: this.fb.control(null)
    });
  }

  enableDialerChecked(checked: boolean): void {
    this.optionalDialerControls.forEach(controlName => {
      const control = this.formGroup.get(controlName);

      if (checked) {
        control.enable();
      } else {
        control.reset();
        control.disable();
      }
    })

    const validators = checked ? Validators.required : null;
    this.formGroup.get('schedule').setValidators(validators);
  }

  submit(): void {
    if (this.formGroup.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      this.callbackService.multipleUpdate(this.checkedItems, this.formGroup.value).then(response => {
        this.isSubmitting = false;

        if (response) {
          this.dialogRef.close(response)
        }
      });
    }
  }
}
