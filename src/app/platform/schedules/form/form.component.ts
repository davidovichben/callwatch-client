import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { ScheduleService } from 'src/app/_shared/services/http/schedule.service';
import { NotificationService } from 'src/app/_shared/services/generic/notification.service';

import { TranslatePipe } from 'src/app/_shared/pipes/translate/translate.pipe';

import { ScheduleTypes } from 'src/app/_shared/models/schedule.model';
import { ErrorMessages } from 'src/app/_shared/constants/error-messages';
import { WeekDays } from 'src/app/_shared/constants/general';
import { SelectItemModel } from 'src/app/_shared/models/select-item.model';
import { CallTimeModel } from 'src/app/_shared/models/call-time.model';

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

  callTimes: CallTimeModel[] = [];

  isSubmitting = false;

  constructor(private router: Router, private route: ActivatedRoute,
              private fb: FormBuilder, private scheduleService: ScheduleService,
              private notification: NotificationService, private t: TranslatePipe) {}

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
      description: this.fb.control(null)
    });

    this.callTimeForm = this.fb.group({
      day: this.fb.control(null, Validators.required),
      startTime: this.fb.control(null, Validators.required),
      endTime: this.fb.control(null, Validators.required),
      allDay: this.fb.control(null)
    });
  }

  typeChanged(selectedValue: string): void {
    const currentValue = this.scheduleForm.get('type').value;

    if (currentValue !== selectedValue && this.callTimes.length > 0) {
      const msg = this.t.transform('schedule_type_changed_warning');
      this.notification.warning(msg).then(confirmation => {
        if (confirmation.value) {
          this.callTimes = [];
          this.callTimeForm.get('day').reset();
        } else {
          setTimeout(() => this.scheduleForm.get('type').patchValue(currentValue), 0);
        }
      })
    } else {
      this.callTimeForm.get('day').reset();
    }
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

      const callTime = this.callTimeForm.value;
      callTime.isActive = true;
      this.callTimes.push(callTime);

      this.allDayChecked(false);

      this.callTimeForm.reset();

      setTimeout( () => {
        Object.keys(this.callTimeForm.controls).forEach(key => {
          this.callTimeForm.get(key).setErrors(null);
        })
      }, 0)
    }
  }

  confirmTimeUpdate(callTime: CallTimeModel, startTime: string, endTime: string): void {
    if ((startTime && !endTime) || (!startTime && endTime)) {
      const msg = this.t.transform('schedule_times_missing_error');
      this.notification.error(msg);
      return;
    }

    if (!startTime && !endTime) {
      startTime = null;
      endTime = null;
    }

    callTime.startTime = startTime;
    callTime.endTime = endTime;
    callTime.editing = false;
  }

  removeCallTime(index: number): void {
    this.callTimes.splice(index, 1);
  }

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
