import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { Subscription, timeInterval } from 'rxjs';
import moment from 'moment';

import { UnitSelectComponent } from 'src/app/_shared/components/unit-select/unit-select.component';
import { DateRangePickerComponent } from 'src/app/_shared/components/date-range-picker/date-range-picker.component';

import { HistoricalReportsService } from 'src/app/_shared/services/state/historical-reports.service';
import { NotificationService } from 'src/app/_shared/services/generic/notification.service';
import { ReportCriteriaService } from 'src/app/_shared/services/http/report-criteria.service';
import { UserSessionService } from 'src/app/_shared/services/state/user-session.service';
import { LocaleService } from 'src/app/_shared/services/state/locale.service';

import { TranslatePipe } from 'src/app/_shared/pipes/translate/translate.pipe';

import { SortDirections, WeekDays } from 'src/app/_shared/constants/general';
import { UnitModel } from 'src/app/_shared/models/unit.model';
import {
  Hours,
  MinutesInterval,
  ReportCriteriaModel,
  ReportTimeIntervals
} from 'src/app/_shared/models/report-criteria.model';
import { ReportTemplateModel } from 'src/app/_shared/models/report-template.model';
import { ErrorMessages } from 'src/app/_shared/constants/error-messages';

@Component({
  selector: 'app-criteria',
  templateUrl: './criteria.component.html',
  styleUrls: ['./criteria.component.sass']
})
export class CriteriaComponent implements OnInit, OnDestroy {

  @ViewChild(UnitSelectComponent) unitsSelect: UnitSelectComponent;
  @ViewChild(DateRangePickerComponent) dateRange: DateRangePickerComponent;

  readonly sub = new Subscription();

  readonly errorMessages = ErrorMessages;

  units: UnitModel[] = [];
  reportTemplate: ReportTemplateModel;

  readonly weekDays = WeekDays;
  readonly sortDirections = SortDirections;
  readonly timeIntervals = ReportTimeIntervals;
  readonly minutesInterval = MinutesInterval;
  readonly hours = Hours;
  readonly timeInterval = timeInterval;

  formGroup: UntypedFormGroup;

  userId: string;

  constructor(private fb: UntypedFormBuilder, private route: ActivatedRoute,
              private router: Router, public reportStateService: HistoricalReportsService,
              private notifications: NotificationService, private t: TranslatePipe,
              private reportCriteriaService: ReportCriteriaService, private userService: UserSessionService,
              public locale: LocaleService) {}

  ngOnInit(): void {
    this.units = this.route.snapshot.data.units;
    this.userId = this.userService.getUserId();

    this.makeForm();
    
    // const sub = this.reportStateService.reportTemplateChanged.subscribe(() => {
    //   this.getReportCriteria();
    // })
    //
    // this.sub.add(sub);

    // this.reportTemplate = this.reportStateService.getReportTemplate();
    // this.getReportCriteria();
  }

  // async getReportCriteria(): Promise<void> {
  //   this.reportTemplate = this.reportStateService.getReportTemplate();
  //
  //   if (this.reportTemplate) {
  //     this.makeForm();
  //     const report = await this.reportCriteriaService.getReportCriteria(this.reportTemplate.module, this.reportTemplate.name, this.userId);
  //     this.makeForm(report);
  //   }
  // }

  private makeForm(criteria?: ReportCriteriaModel): void {
    this.formGroup = this.fb.group({
      startDate: this.fb.control(null),
      endDate: this.fb.control(null),
      dates: this.fb.group({
        start: this.fb.control(null),
        end: this.fb.control(null),
      }),
      groupByUnit: this.fb.control(false),
      times: this.fb.array([]),
      weekDays: this.fb.group({}),
      // showInternal: this.fb.control(true),
      // showExternal: this.fb.control(true),
      interval: this.fb.control('minute'),
      sort: this.fb.array([]),
      ignoreDates: this.fb.group({
        start: this.fb.control(null),
        end: this.fb.control(null),
      }),
      units: this.fb.control(null)
    });
    
    this.weekDays.forEach(day => {
      const control = this.fb.control(false);
      (this.formGroup.get('weekDays') as UntypedFormGroup).addControl(day, control);
    });

    if (criteria) {
      this.setTimes(criteria);

      criteria.sort.forEach(values => {
        this.addSortColumn();
        this.setColumnDisabled(values.column, true);
      });

      criteria.weekDays.forEach(day => {
        this.formGroup.get('weekDays').get(day).setValue(true);
      });

      this.formGroup.patchValue(criteria);
    }

    // this.resetFields(criteria);

    if ((this.formGroup.get('times') as UntypedFormArray).length === 0) {
      this.addTime();
    }

    if ((this.formGroup.get('sort') as UntypedFormArray).length === 0) {
      this.addSortColumn();
    }
  }

  resetFields(criteria: ReportCriteriaModel): void {
    let formReset = false;

    if (!criteria) {
      this.formGroup.reset({
        timeSpace: 'day',
        // showInternal: true,
        // showExternal: true,
        weekDays: { sun: true, mon: true, tue: true, wed: true, thu: true, fri: true, sat: true },
      });

      formReset = true;
    }

    if (this.unitsSelect && (formReset || criteria.units?.length === 0)) {
      this.unitsSelect.reset();
    }

    if (this.dateRange && (formReset || !criteria.dates)) {
      this.dateRange.reset();
    }
  }

  setTimes(criteria: ReportCriteriaModel): void {
    if (!criteria.times) {
      return;
    }

    criteria.times.forEach((time, index) => {
      this.addTime();

      const startString = time.start.split(':')
      const endString = time.end.split(':')

      const start = { hour: startString[0], minute: startString[1] };
      const end = { hour: endString[0], minute: endString[1] };

      criteria.times[index] = { start, end };
    });
  }

  addTime(): void {
    const setDefault = this.formGroup.get('times').value.length === 0;

    const group = this.fb.group({
      start: this.fb.group({
        hour: setDefault ? '00' : null,
        minute: setDefault ? '00' : null
      }),
      end: this.fb.group({
        hour: setDefault ? '23' : null,
        minute: setDefault ? '45' : null
      })
    });

    (this.formGroup.get('times') as UntypedFormArray).push(group);
  }

  removeTime(index: number): void {
    (this.formGroup.get('times') as UntypedFormArray).removeAt(index);
  }

  addSortColumn(): void {
    const setDefault = this.formGroup.get('sort').value.length === 0;
    const group = this.fb.group({
      column: this.fb.control(setDefault ? 'date' : null),
      direction: this.fb.control(setDefault ? 'desc' : null)
    });

    (this.formGroup.get('sort') as UntypedFormArray).push(group);
  }

  removeSortColumn(index: number): void {
    const columnId = this.formGroup.get('sort.' + index + '.column').value;
    if (columnId) {
      this.setColumnDisabled(columnId, false);
    }

    (this.formGroup.get('sort') as UntypedFormArray).removeAt(index);
  }

  sortColumnSelected(value: string, index: number): void {
    if (value) {
      this.setColumnDisabled(value, true);
    }

    const columnId = this.formGroup.get('sort.' + index + '.column').value;
    this.setColumnDisabled(columnId, false);

    const direction = value ? 'desc' : null;
    this.formGroup.get('sort.' + index + '.direction').patchValue(direction);
  }

  setColumnDisabled(columnId: string, disabled: boolean): void {
    const column = this.reportTemplate.columns.find(column => column.id === columnId);
    if (column) {
      column.disabled = disabled;
    }
  }

  timeByIndex(index: number): UntypedFormControl {
    return <UntypedFormControl>(this.formGroup.get('times') as UntypedFormArray).controls[index];
  }

  timeRangeCheck(index: number): void {
    let time = this.timeByIndex(index);
    const startTime = time.get('start').value;
    const endTime = time.get('end').value;
    let hasRangeError = false;

    if (!startTime.hour || !startTime.minute || !endTime.hour || !endTime.minute) {
      time.setErrors(null);
      return;
    }

    if (startTime.hour > endTime.hour) {
      hasRangeError = true;
    }

    if (startTime.hour === endTime.hour) {
      hasRangeError = startTime.minute >= endTime.minute;
    }

    if (hasRangeError) {
      time.setErrors({ range: true });
    } else {
      time.setErrors(null);
    }
  }

  submit(): void {
    // const units = this.formGroup.get('units').value;
    // if (!units || units.length === 0) {
    //   this.notifications.error(this.t.transform('units_field_is_required'));
    //   return;
    // }
    //
    // if (!this.formGroup.valid) {
    //   return;
    // }

    const values = this.sanitizeValues(this.formGroup.value);

    // this.reportCriteriaService.newReportCriteria(values, this.userId, this.reportTemplate.name, this.reportTemplate.module)
    this.reportStateService.setCriteria(values);

    this.router.navigate(['..', 'results'], { relativeTo: this.route });
  }

  private sanitizeValues(values: ReportCriteriaModel): ReportCriteriaModel {
    values.weekDays = Object.keys(values.weekDays).filter(day => !!values.weekDays[day]);

    this.sanitizeDates(values, 'dates');
    this.sanitizeDates(values, 'ignoreDates')

    this.sanitizeTime(values)

    values.sort = values.sort.filter(sort => sort.column && sort.direction);
    
    return values;
  }

  private sanitizeDates(values: object, type: string): void {
    if (!values[type].start || !values[type].end) {
      delete values[type];
    } else {
      values[type].start = typeof values[type].start === 'string' ? values[type].start : (values[type].start as any).format('yy-MM-DD');
      values[type].end = typeof values[type].end === 'string' ? values[type].end : (values[type].end as any).format('yy-MM-DD');
    }
  }

  private sanitizeTime(values: any): any {
    const times = values.times.filter(time => {
      return (time.start?.hour || time.start?.minute) && (time.end?.hour || time.end?.minute);
    });

    return values.times = times.map(time => {
      return {
        start: time.start.hour + ':' + time.start.minute,
        end: time.end.hour + ':' + time.end.minute
      }
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
