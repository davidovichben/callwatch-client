import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';

import { ScheduleService } from 'src/app/_shared/services/http/schedule.service';

import { ScheduleTypes } from 'src/app/_shared/models/schedule.model';
import { ErrorMessages } from 'src/app/_shared/constants/error-messages';
import { WeekDays } from 'src/app/_shared/constants/general';
import { SelectItemModel } from 'src/app/_shared/models/select-item.model';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html'
})
export class FormComponent {

  readonly types = ScheduleTypes;
  readonly weekDays = WeekDays;
  readonly errorMessages = ErrorMessages;

  uniqueDays: SelectItemModel[] = [];

  scheduleForm: FormGroup;
  callTimeForm: FormGroup;

  scheduleId: number;

  isSubmitting = false;

  constructor(private router: Router, private route: ActivatedRoute,
              private fb: FormBuilder, private scheduleService: ScheduleService) {}

  ngOnInit() {
    this.setForms();

    const routeData = this.route.snapshot.data;

    this.uniqueDays = routeData.uniqueDays;
    if (routeData.schedule) {
      this.scheduleId = routeData.schedule.id;
      this.scheduleForm.patchValue(routeData.schedule);
    }
  }

  private setForms(): void {
    this.scheduleForm = this.fb.group({
      name: this.fb.control(null, Validators.required),
      type: this.fb.control(null, Validators.required),
      description: this.fb.control(null),
      callTimes: this.fb.array([])
    });

    this.callTimeForm = this.fb.group({
      day: this.fb.control(null, Validators.required),
      startTime: this.fb.control(null, Validators.required),
      endTime: this.fb.control(null, Validators.required)
    })
  }

  allDayChecked(checked: boolean): void {
    const startTime = this.callTimeForm.get('startTime');
    const endTime = this.callTimeForm.get('endTime');
    const validators = checked ? [] : [Validators.required];
    
    [startTime, endTime].forEach(ctrl => {
      if (checked) {
        ctrl.disable();
      } else {
        ctrl.enable();
      }

      ctrl.setValidators(validators);
      ctrl.reset();
      ctrl.updateValueAndValidity();
    });
  }

  addCallTime(): void {
    if (this.callTimeForm.valid) {
      (this.scheduleForm.get('callTimes') as FormArray).push(this.callTimeForm);
    }
  }

  removeCallTime(index: number): void {
    (this.scheduleForm.get('callTimes') as FormArray).removeAt(index);
  }

  //TODO: check unique and week day uniqueness

  submit(): void {
    if (this.scheduleForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;

      if (this.scheduleId) {
        this.scheduleService.updateSchedule(this.scheduleId, this.scheduleForm.value).then(response => {
          this.handleServerResponse(response);
        });
      } else {
        this.scheduleService.newSchedule(this.scheduleForm.value).then(response => {
          this.handleServerResponse(response);
        });
      }
    }
  }

  private handleServerResponse(response: boolean): void {
    if (response) {
      this.router.navigate(['/platform', 'schedules']);
    }

    this.isSubmitting = false;
  }

}
