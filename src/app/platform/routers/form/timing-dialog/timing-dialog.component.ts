import { Component, Inject } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { SelectItemModel } from 'src/app/_shared/models/select-item.model';
import { ErrorMessages } from 'src/app/_shared/constants/error-messages';
import { Fade } from 'src/app/_shared/constants/animations';

@Component({
  selector: 'app-timing-dialog',
  templateUrl: './timing-dialog.component.html',
  animations: [Fade]
})
export class TimingDialogComponent {

  readonly errorMessages = ErrorMessages;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { values?: any, schedules: SelectItemModel[] },
              private dialogRef: MatDialogRef<TimingDialogComponent>) {}

  submit(form: NgForm): void {
    if (form.valid) {
      this.dialogRef.close(form.value);
    }
  }
}
