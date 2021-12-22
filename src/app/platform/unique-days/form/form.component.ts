import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { UniqueDayService } from 'src/app/_shared/services/http/unique-day.service';
import { HelpersService } from 'src/app/_shared/services/generic/helpers.service';

import { ErrorMessages } from 'src/app/_shared/constants/error-messages';
import { UniqueDayModel, UniqueDayTypes } from 'src/app/_shared/models/unique-day.model';
import { isDateGreaterOrEqual } from 'src/app/_shared/constants/validators';

@Component({
	selector: 'app-form',
	templateUrl: './form.component.html'
})
export class FormComponent implements OnInit, OnDestroy {

  readonly sub = new Subscription();
	readonly errorMessages = ErrorMessages;
  readonly types = UniqueDayTypes;

  uniqueDay: UniqueDayModel;

  uniqueDayForm: FormGroup;

	isSubmitting = false;

	constructor(private router: Router, private route: ActivatedRoute,
              private fb: FormBuilder, private uniqueDayService: UniqueDayService,
              private helpers: HelpersService) {}

	ngOnInit(): void {
    this.setForm();
    this.setFormSubscriptions();

    this.uniqueDay = this.route.snapshot.data.uniqueDay;
    if (this.uniqueDay) {
      this.uniqueDayForm.patchValue(this.uniqueDay);
      this.allDayChecked(this.uniqueDay.allDay);
    }
	}

  private setForm(): void {
    this.uniqueDayForm = this.fb.group({
      name: this.fb.control(null, Validators.required),
      startDate: this.fb.control(null, Validators.required),
      endDate: this.fb.control(null),
      startTime: this.fb.control(null, Validators.required),
      endTime: this.fb.control(null, Validators.required),
      allDay: this.fb.control(null),
      description: this.fb.control(null)
    })

    const validators = [Validators.required, isDateGreaterOrEqual.bind(this, this.uniqueDayForm.get('startDate'))];
    this.uniqueDayForm.get('endDate').setValidators(validators);
  }

  private setFormSubscriptions(): void {
    const sub = this.uniqueDayForm.get('startDate').valueChanges.subscribe(() => {
      this.uniqueDayForm.get('endDate').updateValueAndValidity();
      this.uniqueDayForm.get('endDate').markAsTouched();
    })

    this.sub.add(sub);
  }

  allDayChecked(checked: boolean): void {
    const validators = checked ? [] : [Validators.required];

    const startTime = this.uniqueDayForm.get('startTime');
    const endTime = this.uniqueDayForm.get('endTime');

    [startTime, endTime].forEach(ctrl => {
      checked ? ctrl.disable() : ctrl.enable();

      ctrl.setValidators(validators);
      ctrl.updateValueAndValidity();
    });
  }

	submit(): void {
		if (this.uniqueDayForm.valid && !this.isSubmitting) {
			this.isSubmitting = true;

      if (this.uniqueDay.id) {
        this.uniqueDayService.updateUniqueDay(this.uniqueDay.id, this.uniqueDayForm.value).then(response => this.handleServerResponse(response));
			} else {
				this.uniqueDayService.newUniqueDay(this.uniqueDayForm.value).then(response => this.handleServerResponse(response));
			}
		}
	}

	private handleServerResponse(response: boolean): void {
		if (response) {
			this.router.navigate(['/platform', 'uniqueDays']);
		}

		this.isSubmitting = false;
	}

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
