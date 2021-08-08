import { Component, Inject } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { GroupService } from 'src/app/_shared/services/http/group.service';

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
              private groupService: GroupService) {}

  submit(form: NgForm): void {
    if (form.valid && !this.isSubmitting) {
      this.isSubmitting = true;

      if (this.data.group.id) {
        this.groupService.updateGroup(this.data.group.id, form.value).then(response => {
          this.handleServerResponse(response);
        });
      } else {
        this.groupService.newGroup(form.value).then(response => {
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
