import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';

import { ReportCriteriaModel, ReportProductionTimeRanges } from 'src/app/_shared/models/report-criteria.model';
import { ReportColumnModel } from 'src/app/_shared/models/report-column.model';
import { ErrorMessages } from 'src/app/_shared/constants/error-messages';
import { ReportFormats } from 'src/app/_shared/models/report-template.model';
import { SortDirections, WeekDays } from 'src/app/_shared/constants/general';
import { Fade } from 'src/app/_shared/constants/animations';

@Component({
  selector: 'app-criteria',
  templateUrl: './criteria.component.html',
  styleUrls: ['./criteria.component.sass'],
  animations: [Fade]
})
export class CriteriaComponent implements OnInit {

  @Input() criteria: ReportCriteriaModel;
  @Input() formGroup: UntypedFormGroup;
  @Input() columns: ReportColumnModel[] = [];

  readonly errorMessages = ErrorMessages;
  readonly formats = ReportFormats;
  readonly timeRanges = ReportProductionTimeRanges;
  readonly sortDirections = SortDirections;
  readonly weekDays = WeekDays;

  constructor(private fb: UntypedFormBuilder) {}

  ngOnInit(): void {
    this.weekDays.forEach((day) => {
      const value = this.criteria ? this.criteria.weekDays.includes(day) : true;
      const control = this.fb.control(value);
      (this.formGroup.get('weekDays') as UntypedFormGroup).addControl(day, control);
    });
    
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
    const column = this.columns.find(column => column._id === columnId);
    if (column) {
      column.disabled = disabled;
    }
  }
  
  addSortColumn(sort?: { column: string, direction: string }): void {
    const group = this.fb.group({
      column: this.fb.control(sort ? sort.column : null),
      direction: this.fb.control(sort ? sort.direction : null)
    });

    (this.formGroup.get('sort') as UntypedFormArray).push(group);

    if (sort) {
      this.setColumnDisabled(sort.column, true)
    }
  }

  removeSortColumn(index: number): void {
    const columnId = this.formGroup.get('sort.' + index + '.column').value;
    if (columnId) {
      this.setColumnDisabled(columnId, false);
    }

    (this.formGroup.get('sort') as UntypedFormArray).removeAt(index);
  }
}
