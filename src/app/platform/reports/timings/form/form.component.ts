import { Component, OnInit } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ErrorMessages } from 'src/app/_shared/constants/error-messages';
import { Fade } from 'src/app/_shared/constants/animations';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  animations: [Fade]
})
export class FormComponent implements OnInit {

  readonly errorMessages = ErrorMessages;

  formGroup: FormGroup;

  isSubmitting = false;

  constructor(private router: Router,
              private route: ActivatedRoute) {}

  ngOnInit(): void {

  }

  submit(): void {
    if (this.formGroup.valid && !this.isSubmitting) {
      this.isSubmitting = true;

      // if (this.reportSet.id) {
      //   this.reportSetService.updateReportSet(this.reportSet.id, form.value).then(response => {
      //     this.handleServerResponse(response);
      //   });
      // } else {
      //   this.reportSetService.newReportSet(form.value).then(response => {
      //     this.handleServerResponse(response);
      //   });
      // }
    }
  }

  private handleServerResponse(response: boolean): void {
    if (response) {
      this.router.navigate(['/platform', 'reports', 'timings']);
    }

    this.isSubmitting = false;
  }
}

