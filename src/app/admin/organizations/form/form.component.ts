import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { OrganizationModel } from 'src/app/_shared/models/organization.model';

import { OrganizationService } from 'src/app/_shared/services/http/organization.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html'
})
export class FormComponent implements OnInit {

  organization: OrganizationModel;

  isSubmitting = false;

  constructor(private route: ActivatedRoute, private router: Router,
              private organizationService: OrganizationService) {}

  ngOnInit(): void {
    this.organization = this.route.snapshot.data.organization ?? new OrganizationModel();
  }

  submit(form: NgForm): void {
    if (form.valid && !this.isSubmitting) {
      this.isSubmitting = true;

      if (this.organization.id) {
        this.organizationService.updateOrganization(this.organization.id, form.value).then(response => this.handleServerResponse(response));
      } else {
        this.organizationService.newOrganization(form.value).then(response => this.handleServerResponse(response));
      }
    }
  }

  private handleServerResponse(response: boolean): void {
    if (response) {
      this.router.navigate(['/admin', 'organizations']);
    }

    this.isSubmitting = false;
  }
}
