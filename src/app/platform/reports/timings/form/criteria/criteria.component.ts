import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

import { AbandonTimes, ReportCriteriaModel, ReportProductionTimeRanges, ReportTimeSpaces } from 'src/app/_shared/models/report-criteria.model';
import { ReportColumnModel } from 'src/app/_shared/models/report-column.model';
import { ErrorMessages } from 'src/app/_shared/constants/error-messages';
import { ReportFormats } from 'src/app/_shared/models/report-template.model';
import { SortDirections, WeekDays } from 'src/app/_shared/constants/general';
import { Fade } from 'src/app/_shared/constants/animations';

@Component({
  selector: 'app-criteria',
  templateUrl: './criteria.component.html',
  styleUrls: ['./criteria.component.styl'],
  animations: [Fade]
})
export class CriteriaComponent implements OnInit {

  @Input() criteria: ReportCriteriaModel;
  @Input() formGroup: FormGroup;
  @Input() columns: ReportColumnModel[] = [];

  readonly errorMessages = ErrorMessages;
  readonly formats = ReportFormats;
  readonly timeRanges = ReportProductionTimeRanges;
  readonly timeSpaces = ReportTimeSpaces;
  readonly abandonTimes = AbandonTimes;
  readonly sortDirections = SortDirections;
  readonly weekDays = WeekDays;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.weekDays.forEach((day) => {
      const value = this.criteria ? this.criteria.weekDays.includes(day) : true;
      const control = this.fb.control(value);
      (this.formGroup.get('weekDays') as FormGroup).addControl(day, control);
    });

    if (this.criteria?.times.length > 0) {
      this.criteria.times.forEach(time => this.addTime(time));
    } else {
      this.addTime();
    }

    if (this.criteria?.sort.length > 0) {
      this.criteria.sort.forEach(sort => this.addSortColumn(sort));
    } else {
      this.addSortColumn();
    }
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
    const column = this.columns.find(column => column.id === columnId);
    if (column) {
      column.disabled = disabled;
    }
  }

  addTime(time?: { start: string, end: string }): void {
    const group = this.fb.group({
      start: this.fb.control(time ? time.start : null),
      end: this.fb.control(time ? time.end : null)
    });

    (this.formGroup.get('times') as FormArray).push(group);
  }

  removeTime(index: number): void {
    (this.formGroup.get('times') as FormArray).removeAt(index);
  }

  addSortColumn(sort?: { column: string, direction: string }): void {
    const group = this.fb.group({
      column: this.fb.control(sort ? sort.column : null),
      direction: this.fb.control(sort ? sort.direction : null)
    });

    (this.formGroup.get('sort') as FormArray).push(group);

    if (sort) {
      this.setColumnDisabled(sort.column, true)
    }
  }

  removeSortColumn(index: number): void {
    const columnId = this.formGroup.get('sort.' + index + '.column').value;
    if (columnId) {
      this.setColumnDisabled(columnId, false);
    }

    (this.formGroup.get('sort') as FormArray).removeAt(index);
  }
}
