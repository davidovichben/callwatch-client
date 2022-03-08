import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ReportSetService } from 'src/app/_shared/services/http/report-set.service';

import { ReportSetModel } from 'src/app/_shared/models/report-set.model';
import { ErrorMessages } from 'src/app/_shared/constants/error-messages';
import { SelectItemModel } from 'src/app/_shared/models/select-item.model';
import { Fade } from 'src/app/_shared/constants/animations';
import { UnitModel } from 'src/app/_shared/models/unit.model';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  animations: [Fade]
})
export class FormComponent implements OnInit {

  readonly errorMessages = ErrorMessages;

  reportSet = new ReportSetModel();

  reports: SelectItemModel[] = [];
  units: UnitModel[] = [];

  isSubmitting = false;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private reportSetService: ReportSetService) {}

  ngOnInit(): void {
    this.reports = this.route.snapshot.data.reports;
    this.units = this.route.snapshot.data.units;

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

