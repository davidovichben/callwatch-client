import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { ScheduleModel } from 'src/app/_shared/models/schedule.model';
import { ErrorMessages } from 'src/app/_shared/constants/error-messages';
import { NgForm } from '@angular/forms';
import { ScheduleService } from 'src/app/_shared/services/http/schedule.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html'
})
export class FormComponent {

  readonly errorMessages = ErrorMessages;

  isSubmitting = false;

  constructor(@Inject(MAT_DIALOG_DATA) public schedule: ScheduleModel,
              private dialogRef: MatDialogRef<FormComponent>,
              private scheduleService: ScheduleService) {}

  submit(form: NgForm): void {
    if (form.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      this.scheduleService.newSchedule(form.value).then(response => {
        if (response) {
          this.dialogRef.close(true)
        }

        this.isSubmitting = false;
      });
    }
  }

}
