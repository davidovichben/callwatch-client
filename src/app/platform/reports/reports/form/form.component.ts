import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';

import { ReportService } from 'src/app/_shared/services/http/report.service';

import { ReportModel } from 'src/app/_shared/models/report.model';
import { ErrorMessages } from 'src/app/_shared/constants/error-messages';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html'
})
export class FormComponent implements OnInit {

  readonly errorMessages = ErrorMessages;

  report = new ReportModel();

  isSubmitting = false;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private reportService: ReportService) {}

  ngOnInit(): void {
    if (this.route.snapshot.data.report) {
      this.report = this.route.snapshot.data.report;
    }
  }

  submit(form: NgForm): void {
    if (form.valid && !this.isSubmitting) {
      this.isSubmitting = true;

      if (this.report.id) {
        this.reportService.updateReport(this.report.id, form.value).then(response => {
          this.handleServerResponse(response);
        });
      } else {
        this.reportService.newReport(form.value).then(response => {
          this.handleServerResponse(response);
        });
      }
    }
  }

  private handleServerResponse(response: boolean): void {
    if (response) {
      this.router.navigate(['/platform', 'reports']);
    }

    this.isSubmitting = false;
  }
}

