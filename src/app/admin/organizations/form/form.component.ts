import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { OrganizationModel } from 'src/app/_shared/models/organization.model';

import { OrganizationService } from 'src/app/_shared/services/http/organization.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html'
})
export class FormComponent  {

  isSubmitting = false;

  constructor(@Inject(MAT_DIALOG_DATA) public organization: OrganizationModel,
              private dialogRef: MatDialogRef<FormComponent>,
              private organizationService: OrganizationService) {}

  submit(form: NgForm): void {
    if (form.valid && !this.isSubmitting) {
      this.isSubmitting = true;

      const formData = new FormData();
      formData.append('organization', JSON.stringify(form.value));

      if (this.organization.id) {
        this.organizationService.updateOrganization(this.organization.id, formData).then(response => this.handleServerResponse(response));
      } else {
        this.organizationService.newOrganization(formData).then(response => this.handleServerResponse(response));
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
