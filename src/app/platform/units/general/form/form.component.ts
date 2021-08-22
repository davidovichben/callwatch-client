import { Component, Inject } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { UnitPermissionEntityService } from 'src/app/_shared/services/http/unit-permission-entity.service';
import { NotificationService } from 'src/app/_shared/services/generic/notification.service';

import { TranslatePipe } from 'src/app/_shared/pipes/translate/translate.pipe';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html'
})
export class FormComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private dialogRef: MatDialogRef<FormComponent>,
              private unitPermissionEntityService: UnitPermissionEntityService,
              private notification: NotificationService,
              private t: TranslatePipe) {}

  submit(form: NgForm): void {
    if (form.valid) {
      const permissionEntityId = form.value.permissionEntityId;

      this.unitPermissionEntityService.newPermissionEntity(this.data.unitId, permissionEntityId).then(response => {
        this.handleServerResponse(response);
      });
    }
  }

  private handleServerResponse(response: any): void {
    if (response.error) {
      if (response.errorCode) {
        this.notification.error(this.t.transform('values_exist'));
      }
    } else {
      this.dialogRef.close(true);
    }
  }
}
