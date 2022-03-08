import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';

import { HistoricalReportsService } from 'src/app/_shared/services/state/historical-reports.service';

import { SortDirections, WeekDays } from 'src/app/_shared/constants/general';
import { UnitModel } from 'src/app/_shared/models/unit.model';
import { AbandonTimes, ReportTimeSpaces } from 'src/app/_shared/models/report-criteria.model';
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

    this.reportTemplate = this.reportStateService.getReportTemplate();
    const sub = this.reportStateService.reportTemplateChanged.subscribe(() => {
      this.reportTemplate = this.reportStateService.getReportTemplate();
    })

    this.sub.add(sub);

    this.makeForm();
  }

  private makeForm(): void {
    this.formGroup = this.fb.group({
      dates: this.fb.group({
        from: this.fb.control(null),
        to: this.fb.control(null),
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
        from: this.fb.control(null),
        to: this.fb.control(null),
      }),
      units: this.fb.control(null)
    });

    this.weekDays.forEach((day, index) => {
      const control = this.fb.control(true);
      (this.formGroup.get('weekDays') as FormGroup).addControl(index.toString(), control);
    });

    const criteria = this.reportStateService.getCriteria();
    if (criteria) {
      criteria.times.forEach(() => this.addTime());
      criteria.sort.forEach(() => this.addSortColumn());

      this.formGroup.patchValue(criteria);
    } else {
      this.addTime();
      this.addSortColumn();
    }
  }

  addTime(): void {
    const group = this.fb.group({
      from: this.fb.control(null),
      to: this.fb.control(null)
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

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
