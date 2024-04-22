import { Component, Inject } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';

import { UnitUserService } from 'src/app/_shared/services/http/unit-user.service';
import { NotificationService } from 'src/app/_shared/services/generic/notification.service';

import { TranslatePipe } from 'src/app/_shared/pipes/translate/translate.pipe';

import { ErrorMessages } from 'src/app/_shared/constants/error-messages';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html'
})
export class FormComponent {

  readonly errorMessages = ErrorMessages;

  isSubmitting = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private dialogRef: MatDialogRef<FormComponent>,
              private unitUserService: UnitUserService,
              private notification: NotificationService,
              private t: TranslatePipe) {}

  submit(form: NgForm): void {
    if (form.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      const userId = form.value.userId;

      this.unitUserService.newUser(this.data.unitId, userId).then(response => {
        this.handleServerResponse(response);
        this.isSubmitting = false;
      });
    }
  }

  private handleServerResponse(response: any): void {
    if (response.error) {
      if (response.error.errorCode === 1) {
        this.notification.error(this.t.transform('values_exist'));
      }
    } else {
      this.dialogRef.close(true);
    }
  }
}
