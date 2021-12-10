import { Component, Inject } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { SelectItemModel } from 'src/app/_shared/models/select-item.model';
import { ErrorMessages } from 'src/app/_shared/constants/error-messages';
import { Fade } from 'src/app/_shared/constants/animations';
import { RouterMessageModel } from 'src/app/_shared/models/router-message.model';

@Component({
  selector: 'app-message-timing',
  templateUrl: './message-timing.component.html',
  animations: [Fade]
})
export class MessageTimingComponent {

  readonly errorMessages = ErrorMessages;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { message?: RouterMessageModel, schedules: SelectItemModel[] },
              private dialogRef: MatDialogRef<MessageTimingComponent>) {}

  submit(form: NgForm): void {
    if (form.valid) {
      this.dialogRef.close(form.value);
    }
  }

}
