import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { CriteriaComponent } from './criteria/criteria.component';

import { ReportTimingService } from 'src/app/_shared/services/http/report-timing.service';

import { ErrorMessages } from 'src/app/_shared/constants/error-messages';
import { Fade } from 'src/app/_shared/constants/animations';
import { ReportTemplateModel } from 'src/app/_shared/models/report-template.model';
import { WeekDays } from 'src/app/_shared/constants/general';
import { SelectItemModel } from 'src/app/_shared/models/select-item.model';
import { ReportCriteriaModel } from 'src/app/_shared/models/report-criteria.model';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.sass'],
  animations: [Fade]
})
export class FormComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild(CriteriaComponent) criteriaComponent: CriteriaComponent;

  readonly sub = new Subscription();
  readonly errorMessages = ErrorMessages;
  readonly weekDays = WeekDays;
  readonly monthDays = Array.from({ length: 31 }, (_, i) => i + 1)

  currentStep = 1;

  reportTimingId: number;
  criteria: ReportCriteriaModel;

  reportTemplates: ReportTemplateModel[] = [];
  users: SelectItemModel[] = [];
  units: SelectItemModel[] = [];

  formGroup: UntypedFormGroup;

  columns = [];

  isSubmitting = false;

  constructor(private router: Router, private route: ActivatedRoute,
              private fb: UntypedFormBuilder, private reportTimingService: ReportTimingService) {}

  ngOnInit(): void {
    this.makeForm();
    this.setFormSubscriptions();

    const routeData = this.route.snapshot.data;
    this.reportTemplates = routeData.reportTemplates;
    this.users = routeData.users;
    this.units = routeData.units;
    if (routeData.reportTiming) {
      const timing = routeData.reportTiming;

      this.reportTimingId = timing.id;
      this.criteria = timing.criteria;

      timing.general.reportTemplate = this.reportTemplates.find(template => template.id === timing.general.reportTemplate);
      this.columns = timing.general.reportTemplate.columns;
    }
  }

  ngAfterViewInit(): void {
    if (this.route.snapshot.data.reportTiming) {
      setTimeout(() => this.formGroup.patchValue(this.route.snapshot.data.reportTiming), 0);
    }
  }

  makeForm(): void {
    this.formGroup = this.fb.group({
      general: this.fb.group({
        name: this.fb.control(null, Validators.required),
        reportTemplate: this.fb.control(null, Validators.required),
        columns: this.fb.control(null, Validators.required),
        isActive: this.fb.control(true)
      }),
      production: this.fb.group({
        dateType: this.fb.control('day'),
        dates: this.fb.control(null),
        time: this.fb.control(null, Validators.required)
      }),
      criteria: this.fb.group({
        format: this.fb.control(null, Validators.required),
        distribution: this.fb.control('email', Validators.required),
        timeRange: this.fb.control('day', Validators.required),
        times: this.fb.array([]),
        timeSpace: this.fb.control('15_minutes', Validators.required),
        weekDays: this.fb.group({}),
        callingNumber: this.fb.control(null),
        calledNumber: this.fb.control(null),
        showInternal: this.fb.control(true),
        showExternal: this.fb.control(true),
        abandonTime: this.fb.control(null),
        sort: this.fb.array([]),
        ignoreDates: this.fb.group({
          start: this.fb.control(null),
          end: this.fb.control(null),
        })
      }),
      distribution: this.fb.group({
        users: this.fb.control(null),
        units: this.fb.control(null),
        allUsers: this.fb.control(null),
        allUnits: this.fb.control(null)
      })
    });
  }

  private setFormSubscriptions(): void {
    const dateTypeSub = this.formGroup.get('production.dateType').valueChanges.subscribe(value => {
      const validators = value !== 'day' ? Validators.required : null;
      this.formGroup.get('production.dates').reset();
      this.formGroup.get('production.dates').setValidators(validators);
      this.formGroup.get('production.dates').updateValueAndValidity();
    });

    this.sub.add(dateTypeSub);

    const columnSub = this.formGroup.get('general.columns').valueChanges.subscribe(columnIds => {
      const templateColumns = this.formGroup.get('general.reportTemplate').value.columns;
      this.criteriaComponent.columns = templateColumns.filter(column => columnIds.includes(column.id));
    });

    this.sub.add(columnSub);
  }

  nextStep(): void {
    const formGroups = Object.keys(this.formGroup.value);
    const currentGroup = formGroups[this.currentStep - 1];

    if (this.formGroup.get(currentGroup).valid) {
      this.currentStep += 1;
    } else {
      const controls = (this.formGroup.get(currentGroup) as UntypedFormGroup).controls;
      Object.keys(controls).forEach(control => controls[control].markAsTouched());
    }
  }

  submit(): void {
    if (this.formGroup.valid && !this.isSubmitting) {
      this.isSubmitting = true;

      const values = this.formGroup.value;
      const spread = { ...values.general, ...values.production, ...values.distribution };
      spread.reportTemplate = spread.reportTemplate.id;
      spread.criteria = this.sanitizeCriteria(values.criteria);

      if (this.reportTimingId) {
        this.reportTimingService.updateReportTiming(this.reportTimingId, spread).then(response => {
          this.handleServerResponse(response);
        });
      } else {
        this.reportTimingService.newReportTiming(spread).then(response => {
          this.handleServerResponse(response);
        });
      }
    }
  }

  private sanitizeCriteria(criteria: ReportCriteriaModel): ReportCriteriaModel {
    criteria.weekDays = Object.keys(criteria.weekDays).filter(day => !!criteria.weekDays[day]);
    if (!criteria.ignoreDates.start || !criteria.ignoreDates.end) {
      delete criteria.ignoreDates;
    }

    criteria.times = criteria.times.filter((time) => time.start && time.end);
    criteria.sort = criteria.sort.filter((sort) => sort.column && sort.direction);

    return criteria;
  }

  private handleServerResponse(response: boolean): void {
    if (response) {
      this.router.navigate(['/platform', 'reports', 'timings']);
    } else {
      this.isSubmitting = false;
    }
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}

