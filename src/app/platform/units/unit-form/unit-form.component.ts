import { Component, Inject } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { UnitService } from 'src/app/_shared/services/http/unit.service';
import { UserSessionService } from 'src/app/_shared/services/state/user-session.service';

import { ErrorMessages } from 'src/app/_shared/constants/error-messages';
import { SelectItemModel } from 'src/app/_shared/models/select-item.model';
import { Fade } from 'src/app/_shared/constants/animations';

@Component({
  selector: 'app-unit-form',
  templateUrl: './unit-form.component.html',
  animations: [Fade]
})
export class UnitFormComponent {

  readonly errorMessages = ErrorMessages;

  isSubmitting = false;

  constructor(@Inject(MAT_DIALOG_DATA) public units: SelectItemModel[],
              private dialogRef: MatDialogRef<UnitFormComponent>,
              private unitService: UnitService,
              public userSession: UserSessionService) {}

  async submit(form: NgForm): Promise<void> {
    if (form.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      
      const response = await this.unitService.newUnit(form.value);
      if (response) {
        this.dialogRef.close(response._id);
      }
      
      this.isSubmitting = false;
    }
  }
}
