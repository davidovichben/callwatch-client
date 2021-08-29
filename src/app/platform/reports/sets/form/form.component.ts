import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';

import { ReportSetService } from 'src/app/_shared/services/http/report-set.service';

import { ReportSetModel } from 'src/app/_shared/models/report-set.model';
import { ErrorMessages } from 'src/app/_shared/constants/error-messages';
import { SelectItemModel } from 'src/app/_shared/models/select-item.model';
import { fade } from 'src/app/_shared/constants/animations';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  animations: [fade]
})
export class FormComponent implements OnInit {

  readonly errorMessages = ErrorMessages;

  reportSet = new ReportSetModel();

  reports: SelectItemModel[] = [];
  users: SelectItemModel[] = [];
  groups: SelectItemModel[] = [];

  isSubmitting = false;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private reportSetService: ReportSetService) {}

  ngOnInit(): void {
    this.reports = this.route.snapshot.data.reports;
    this.users = this.route.snapshot.data.permissionEntities.users;
    this.groups = this.route.snapshot.data.permissionEntities.groups;

    if (this.route.snapshot.data.reportSet) {
      this.reportSet = this.route.snapshot.data.reportSet;
    }
  }

  submit(form: NgForm): void {
    if (form.valid && !this.isSubmitting) {
      this.isSubmitting = true;

      if (this.reportSet.id) {
        this.reportSetService.updateReportSet(this.reportSet.id, form.value).then(response => {
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
      this.router.navigate(['/platform', 'reports', 'sets']);
    }

    this.isSubmitting = false;
  }
}

