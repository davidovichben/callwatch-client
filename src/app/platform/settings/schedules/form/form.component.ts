import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormGroupDirective } from '@angular/forms';

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

  @ViewChild('callTimeFormDirective') callTimeDirective: FormGroupDirective;

  readonly types = ScheduleTypes;
  readonly weekDays = WeekDays;
  readonly errorMessages = ErrorMessages;

  uniqueDays: SelectItemModel[] = [];
  uniqueSchedules: SelectItemModel[] = [];

  formGroup: FormGroup;

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
    this.uniqueSchedules = routeData.uniqueSchedules;
    this.uniqueDays = routeData.uniqueDays;

    if (routeData.schedule) {
      this.scheduleId = routeData.schedule.id;
      this.formGroup.patchValue(routeData.schedule);
      this.callTimes = routeData.schedule.callTimes;
    }
  }

  private setForms(): void {
    this.formGroup = this.fb.group({
      name: this.fb.control(null, Validators.required),
      type: this.fb.control('regular', Validators.required),
      tags: this.fb.control(null),
      description: this.fb.control(null),
      uniqueSchedule: this.fb.control(null)
    });

    this.callTimeForm = this.fb.group({
      day: this.fb.control(null, Validators.required),
      startTime: this.fb.control(null, Validators.required),
      endTime: this.fb.control(null, Validators.required),
      allDay: this.fb.control(null)
    });
  }

  typeChanged(selectedValue: string): void {
    const currentValue = this.formGroup.get('type').value;

    if (selectedValue === 'unique') {
      this.formGroup.get('uniqueSchedule').reset();
    }

    if (currentValue !== selectedValue && this.callTimes.length > 0) {
      const msg = this.t.transform('schedule_type_changed_warning');
      this.notification.warning(msg).then(confirmation => {
        if (confirmation.value) {
          this.callTimes = [];
          this.callTimeForm.get('day').reset();
        } else {
          setTimeout(() => this.formGroup.get('type').patchValue(currentValue), 0);
        }
      })
    } else {
      this.callTimeForm.get('day').reset();
    }
  }

  loadDayTimes(): void {
    const value = this.callTimeForm.get('day').value;
    this.callTimeForm.patchValue(value);
    if (!value) {
      return;
    }

    const controls = ['startTime', 'endTime'];

    controls.forEach((ctrl: string) => {
      value.allDay ? this.callTimeForm.get(ctrl).disable() : this.callTimeForm.get(ctrl).enable();
    });
  }

  allDayChecked(checked: boolean): void {
    const validators = checked ? [] : [Validators.required];

    const startTime = this.callTimeForm.get('startTime');
    const endTime = this.callTimeForm.get('endTime');

    [startTime, endTime].forEach(ctrl => {
      checked ? ctrl.disable() : ctrl.enable();

      ctrl.setValidators(validators);
      ctrl.updateValueAndValidity();
    });
  }

  addCallTime(): void {
    if (this.callTimeForm.valid && this.validateTimeRange()) {
      const callTime = this.callTimeForm.value;
      callTime.isActive = true;

      if (this.checkCallTimesOverlap(callTime)) {
        const msg = this.t.transform('schedule_times_overlapping_error');
        this.notification.error(msg);
        return;
      }

      this.callTimes.push(callTime);

      this.allDayChecked(false);

      this.callTimeDirective.resetForm();
      this.callTimeForm.reset();
    }
  }

  validateTimeRange(startTime?: string, endTime?: string): boolean {
    const start = startTime ? startTime : this.callTimeForm.get('startTime').value;
    const end = endTime ? endTime : this.callTimeForm.get('endTime').value;

    const hasRangeError = end < start;

    if (hasRangeError) {
      this.callTimeForm.setErrors({ range: true });
    } else {
      this.callTimeForm.setErrors(null);
    }

    return !hasRangeError;
  }

  confirmTimeUpdate(callTime: CallTimeModel, startTime: string, endTime: string, allDay: boolean): void {
    let msg;

    if (!this.validateTimeRange(startTime, endTime)) {
      msg = this.t.transform('time_range_error')
    }

    if ((!startTime && !endTime && !allDay) || (startTime && !endTime) || (!startTime && endTime)) {
      msg = this.t.transform('schedule_times_missing_error');
    }

    if (msg) {
      this.notification.error(msg);
      return;
    }

    if (this.checkCallTimesOverlap({ day: callTime.day, startTime, endTime, allDay }, callTime)) {
      const msg = this.t.transform('schedule_times_overlapping_error');
      this.notification.error(msg);
      return;
    }

    if (!startTime && !endTime) {
      startTime = null;
      endTime = null;
    }

    callTime.allDay = allDay;
    callTime.startTime = startTime;
    callTime.endTime = endTime;
    callTime.editing = false;
  }

  removeCallTime(index: number): void {
    this.notification.warning().then(confirmation => {
      if (confirmation.value) {
        this.callTimes.splice(index, 1);
      }
    })
  }

  private checkCallTimesOverlap(callTime: CallTimeModel, ignoredCallTime?: CallTimeModel): boolean {
    const sameDayCallTimes = this.callTimes.filter(iterated => {
      return iterated !== ignoredCallTime && iterated.day === callTime.day;
    });

    if (sameDayCallTimes.length > 0 && callTime.allDay) {
      return true;
    }

    return sameDayCallTimes.some(iterated => {
      if (callTime.allDay) {
        return true;
      }

      const isBefore = callTime.startTime < iterated.startTime && callTime.endTime < iterated.startTime;
      const isAfter = callTime.startTime > iterated.endTime && callTime.endTime > iterated.endTime;

      return !isBefore && !isAfter;
    });
  }

  submit(): void {
    if (this.formGroup.valid && !this.isSubmitting) {
      const editing = this.callTimes.find(callTime => callTime.editing);
      if (editing) {
        const msg = this.t.transform('calltime_editing_submit_error');
        this.notification.error(msg);
        return;
      }

      this.isSubmitting = true;

      const values = { ...this.formGroup.value };
      values.callTimes = [...this.callTimes];
      if (values.type === 'unique') {
        const callTimes = [];
        this.callTimes.forEach(callTime => {
          const row = { ...callTime } as CallTimeModel;
          row.day = row.day.id;
          callTimes.push(row);
        });

        values.callTimes = callTimes;
      }

      if (this.scheduleId) {
        this.scheduleService.updateSchedule(this.scheduleId, values).then(response => {
          this.handleServerResponse(response);
        });
      } else {
        this.scheduleService.newSchedule(values).then(response => {
          this.handleServerResponse(response);
        });
      }
    }
  }

  private handleServerResponse(response: boolean): void {
    if (response) {
      this.router.navigate(['/platform', 'settings', 'schedules']);
    } else {
      this.isSubmitting = false;
    }
  }
}
