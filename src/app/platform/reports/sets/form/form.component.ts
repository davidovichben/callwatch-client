import { Component, Inject } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { ReportSetService } from 'src/app/_shared/services/http/report-set.service';

import { ErrorMessages } from 'src/app/_shared/constants/error-messages';
import { ReportSetModel } from 'src/app/_shared/models/report-set.model';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html'
})
export class FormComponent {

  readonly errorMessages = ErrorMessages;

  isSubmitting = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private dialogRef: MatDialogRef<FormComponent>,
              private reportSetService: ReportSetService) {}

  submit(form: NgForm): void {
    if (form.valid && !this.isSubmitting) {
      this.isSubmitting = true;

      if (this.data.reportSet.id) {
        this.reportSetService.updateReportSet(this.data.reportSet.id, form.value).then(response => {
          this.handleServerResponse(response);
        });
      } else {
        this.reportSetService.newReportSet(form.value).then(response => {
          this.handleServerResponse(response);
        });
      }
    }
  }

  private handleServerResponse(response: boolean): void {
    if (response) {
      this.dialogRef.close(true);
    }

    this.isSubmitting = false;
  }
}
