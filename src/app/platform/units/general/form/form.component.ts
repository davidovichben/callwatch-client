import { Component, Inject } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { UnitUserService } from 'src/app/_shared/services/http/unit-user.service';
import { NotificationService } from 'src/app/_shared/services/generic/notification.service';

import { TranslatePipe } from 'src/app/_shared/pipes/translate/translate.pipe';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html'
})
export class FormComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private dialogRef: MatDialogRef<FormComponent>,
              private unitUserService: UnitUserService,
              private notification: NotificationService,
              private t: TranslatePipe) {}

  submit(form: NgForm): void {
    if (form.valid) {
      const userId = form.value.userId;

      this.unitUserService.newUser(this.data.unitId, userId).then(response => {
        this.handleServerResponse(response);
      });
    }
  }

  private handleServerResponse(response: any): void {
    if (response.error) {
      if (response.error.errorCode) {
        this.notification.error(this.t.transform('values_exist'));
      }
    } else {
      this.dialogRef.close(true);
    }
  }
}
