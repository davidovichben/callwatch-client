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
              private userUnitService: UnitUserService,
              private notification: NotificationService,
              private t: TranslatePipe) {}

  submit(form: NgForm): void {
    if (form.valid) {
      this.userUnitService.newUnitUser(this.data.unitId, form.value.userId, form.value.permissionId).then(response => {
        if (response) {
          if (response.error && response.errorCode) {
            this.notification.error(this.t.transform('values_exist'));
          } else {
            this.dialogRef.close(true);
          }
        }
      });
    }
  }
}
