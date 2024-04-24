import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgForm } from '@angular/forms';

import { UnitModel } from 'src/app/_shared/models/unit.model';
import { ErrorMessages } from 'src/app/_shared/constants/error-messages';
import { Fade } from 'src/app/_shared/constants/animations';

@Component({
  selector: 'app-reassign-dialog',
  templateUrl: './reassign-dialog.component.html',
  animations: [Fade]
})
export class ReassignDialogComponent {

  readonly errorMessages = ErrorMessages;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { units: UnitModel[], replacedUnit: UnitModel},
              private dialogRef: MatDialogRef<ReassignDialogComponent>) {}

  submit(form: NgForm): void {
    if (form.valid) {
      this.dialogRef.close(form.value.unitId);
    }
  }
}
