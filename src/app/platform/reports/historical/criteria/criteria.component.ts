import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { HistoricalReportsService } from 'src/app/_shared/services/state/historical-reports.service';

import { SortDirections, WeekDays } from 'src/app/_shared/constants/general';
import { UnitModel } from 'src/app/_shared/models/unit.model';
import { AbandonTimes, ReportCriteriaModel, ReportTimeSpaces } from 'src/app/_shared/models/report-criteria.model';
import { ReportTemplateModel } from 'src/app/_shared/models/report-template.model';

@Component({
  selector: 'app-criteria',
  templateUrl: './criteria.component.html',
  styleUrls: ['./criteria.component.styl']
})
export class CriteriaComponent implements OnInit, OnDestroy {

  readonly sub = new Subscription();

  units: UnitModel[] = [];
  reportTemplate: ReportTemplateModel;

  readonly weekDays = WeekDays;
  readonly abandonTimes = AbandonTimes;
  readonly timeSpaces = ReportTimeSpaces;
  readonly sortDirections = SortDirections;

  formGroup: FormGroup;

  constructor(private fb: FormBuilder, private route: ActivatedRoute,
              private router: Router, public reportStateService: HistoricalReportsService) {}

  ngOnInit(): void {
    this.units = this.route.snapshot.data.units;

    const sub = this.reportStateService.reportTemplateChanged.subscribe(() => {
      this.reportTemplate = this.reportStateService.getReportTemplate();
      this.makeForm();
    })

    this.sub.add(sub);

    this.reportTemplate = this.reportStateService.getReportTemplate();
    if (this.reportTemplate) {
      this.makeForm();
    }
  }

  private makeForm(): void {
    this.formGroup = this.fb.group({
      dates: this.fb.group({
        start: this.fb.control(null),
        end: this.fb.control(null),
      }),
      times: this.fb.array([]),
      weekDays: this.fb.group({}),
      callingNumber: this.fb.control(null),
      calledNumber: this.fb.control(null),
      showInternal: this.fb.control(true),
      showExternal: this.fb.control(true),
      abandonTime: this.fb.control(null),
      timeSpace: this.fb.control('hour'),
      sort: this.fb.array([]),
      ignoreDates: this.fb.group({
        start: this.fb.control(null),
        end: this.fb.control(null),
      }),
      units: this.fb.control(null)
    });

    this.weekDays.forEach(day => {
      const control = this.fb.control(true);
      (this.formGroup.get('weekDays') as FormGroup).addControl(day, control);
    });

    const criteria = this.reportStateService.getCriteria();
    if (criteria) {
      criteria.times.forEach(() => this.addTime());
      criteria.sort.forEach(values => {
        this.addSortColumn();
        this.setColumnDisabled(values.column, true);
      });

      this.formGroup.patchValue(criteria);
    }

    if ((this.formGroup.get('times') as FormArray).length === 0) {
      this.addTime();
    }

    if ((this.formGroup.get('sort') as FormArray).length === 0) {
      this.addSortColumn();
    }
  }

  addTime(): void {
    const group = this.fb.group({
      start: this.fb.control(null),
      end: this.fb.control(null)
    });

    (this.formGroup.get('times') as FormArray).push(group);
  }

  removeTime(index: number): void {
    (this.formGroup.get('times') as FormArray).removeAt(index);
  }

  addSortColumn(): void {
    const group = this.fb.group({
      column: this.fb.control(null),
      direction: this.fb.control(null)
    });

    (this.formGroup.get('sort') as FormArray).push(group);
  }

  removeSortColumn(index: number): void {
    const columnId = this.formGroup.get('sort.' + index + '.column').value;
    if (columnId) {
      this.setColumnDisabled(columnId, false);
    }

    (this.formGroup.get('sort') as FormArray).removeAt(index);
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

  submit(): void {
    const values = this.sanitizeValues(this.formGroup.value);
    this.reportStateService.setCriteria(values);

    this.router.navigate(['..', 'results'], { relativeTo: this.route });
  }

  private sanitizeValues(values: ReportCriteriaModel): ReportCriteriaModel {
    values.weekDays = Object.keys(values.weekDays).filter(day => !!day);

    this.sanitizeDates(values, 'dates');
    this.sanitizeDates(values, 'ignoreDates')

    values.times = values.times.filter(time => time.start && time.end);
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

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
