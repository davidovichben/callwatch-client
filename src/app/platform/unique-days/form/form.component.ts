import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { UniqueDayService } from 'src/app/_shared/services/http/unique-day.service';

import { ErrorMessages } from 'src/app/_shared/constants/error-messages';
import { UniqueDayModel, UniqueDayTypes } from 'src/app/_shared/models/unique-day.model';

@Component({
	selector: 'app-form',
	templateUrl: './form.component.html'
})
export class FormComponent implements OnInit {

	readonly errorMessages = ErrorMessages;
  readonly types = UniqueDayTypes;

	uniqueDay: UniqueDayModel;

	isSubmitting = false;

	constructor(private router: Router, private route: ActivatedRoute,
				      private uniqueDayService: UniqueDayService) {}

	ngOnInit(): void {
		const routeData = this.route.snapshot.data;

		this.uniqueDay = routeData.uniqueDay ? routeData.uniqueDay : new UniqueDayModel();
	}

  resetTimes(checked: boolean, form: NgForm): void {
    if (!checked) {
      return;
    }

    form.controls.startTime.reset();
    form.controls.endTime.reset();
  }

	submit(form: NgForm): void {
		if (form.valid) {
			this.isSubmitting = true;

			if (this.uniqueDay.id) {
				this.uniqueDayService.updateUniqueDay(this.uniqueDay.id, form.value).then(response => this.handleServerResponse(response));
			} else {
				this.uniqueDayService.newUniqueDay(form.value).then(response => this.handleServerResponse(response));
			}
		}
	}

	private handleServerResponse(response: boolean): void {
		if (response) {
			this.router.navigate(['/platform', 'uniqueDays']);
		}

		this.isSubmitting = false;
	}
}
