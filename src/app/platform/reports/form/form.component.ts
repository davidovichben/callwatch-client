import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { AddComputedColumnComponent } from './add-computed-column/add-computed-column.component';

import { ReportService } from 'src/app/_shared/services/http/report.service';

import { ErrorMessages } from 'src/app/_shared/constants/error-messages';
import { ReportModel, ReportModules } from 'src/app/_shared/models/report.model';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html'
})
export class FormComponent implements OnInit {

  readonly modules = ReportModules;
  readonly errorMessages = ErrorMessages;

  formGroup: FormGroup;

  report: ReportModel;

  currentStep = 1;

  isSubmitting = false;

  constructor(private router: Router, private route: ActivatedRoute,
              private fb: FormBuilder, private dialog: MatDialog,
              private reportService: ReportService) {}

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      name: this.fb.control(null, Validators.required),
      module: this.fb.control(null, Validators.required),
      description: this.fb.control(null),
    });

    this.report = this.route.snapshot.data.report;
    if (this.report) {
      this.formGroup.patchValue(this.report);
    }
  }

  openComputedColumnDialog(): void {
    this.dialog.open(AddComputedColumnComponent);
  }

  submit(): void {
    if (this.formGroup.valid && !this.isSubmitting) {
      this.isSubmitting = true;

      if (this.report) {
        this.reportService.updateReport(this.report.id, this.formGroup.value).then(response => {
          this.handleServerResponse(response);
        });
      } else {
        this.reportService.newReport(this.formGroup.value).then(response => {
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

