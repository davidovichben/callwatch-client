import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

import { HistoricalReportsService } from 'src/app/_shared/services/state/historical-reports.service';

import { SortDirections, WeekDays } from 'src/app/_shared/constants/general';
import { UnitModel } from 'src/app/_shared/models/unit.model';
import { ReportColumnModel } from 'src/app/_shared/models/report-column.model';
import { AbandonTimes, TimeSpaces } from 'src/app/_shared/models/report-criteria.model';

@Component({
  selector: 'app-criteria',
  templateUrl: './criteria.component.html',
  styleUrls: ['./criteria.component.styl']
})
export class CriteriaComponent implements OnInit {

  units: UnitModel[] = [];
  columns: ReportColumnModel[] = [];

  readonly weekDays = WeekDays;
  readonly abandonTimes = AbandonTimes;
  readonly timeSpaces = TimeSpaces;
  readonly sortDirections = SortDirections;

  formGroup: FormGroup;

  constructor(private fb: FormBuilder, private route: ActivatedRoute,
              private router: Router, public reportStateService: HistoricalReportsService) {}

  ngOnInit(): void {
    this.units = this.route.snapshot.data.units;

    this.makeForm();
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
      showInternal: this.fb.control(null),
      showExternal: this.fb.control(null),
      abandonTime: this.fb.control(null),
      timeSpace: this.fb.control('hour'),
      sort: this.fb.array([]),
      ignoreDates: this.fb.group({
        start: this.fb.control(null),
        end: this.fb.control(null),
      }),
    });

    this.addTime();
    this.addSortColumn();

    this.weekDays.forEach((day, index) => {
      const control = this.fb.control(true);
      (this.formGroup.get('weekDays') as FormGroup).addControl(index.toString(), control);
    });

    const criteria = localStorage.getItem('report-criteria');
    if (criteria) {
      this.formGroup.patchValue(JSON.parse(criteria));
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
    (this.formGroup.get('sort') as FormArray).removeAt(index);
  }

  submit(): void {
    this.reportStateService.setCriteria(this.formGroup.value);

    this.router.navigate(['..', 'results'], { relativeTo: this.route });
  }
}
