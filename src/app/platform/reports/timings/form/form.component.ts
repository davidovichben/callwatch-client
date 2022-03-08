import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { DualGroupsSelectComponent } from 'src/app/_shared/components/dual-groups-select/dual-groups-select.component';

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
  styleUrls: ['./form.component.styl'],
  animations: [Fade]
})
export class FormComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('columns') columnsComponent: DualGroupsSelectComponent;

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

  formGroup: FormGroup;

  isSubmitting = false;

  constructor(private router: Router, private route: ActivatedRoute,
              private fb: FormBuilder, private reportTimingService: ReportTimingService) {}

  ngOnInit(): void {
    this.makeForm();
    this.setSubscriptions();

    const routeData = this.route.snapshot.data;
    this.reportTemplates = routeData.reportTemplates;
    this.users = routeData.users;
    this.units = routeData.units;
    if (routeData.reportTiming) {
      const timing = routeData.reportTiming;

      this.reportTimingId = timing.id;
      this.criteria = timing.criteria;

      timing.general.reportTemplate = this.reportTemplates.find(template => template.id === timing.general.reportTemplate);

      this.formGroup.patchValue(timing);
    }
  }

  ngAfterViewInit(): void {
    if (this.reportTimingId) {
      setTimeout(() => {
        this.columnsComponent.availableItems = this.formGroup.get('general.reportTemplate').value.columns;
      }, 1);
    }
  }

  makeForm(): void {
    this.formGroup = this.fb.group({
      general: this.fb.group({
        name: this.fb.control(null, Validators.required),
        reportTemplate: this.fb.control(null, Validators.required),
        columns: this.fb.control(null, Validators.required)
      }),
      production: this.fb.group({
        dateType: this.fb.control('day'),
        dates: this.fb.control(null),
        time: this.fb.control(null, Validators.required)
      }),
      criteria: this.fb.group({
        format: this.fb.control(null),
        distribution: this.fb.control(null),
        timeRange: this.fb.control(null),
        times: this.fb.array([]),
        resolution: this.fb.control(null),
        timeSpace: this.fb.control(null),
        weekDays: this.fb.group({}),
        callingNumber: this.fb.control(null),
        calledNumber: this.fb.control(null),
        showInternal: this.fb.control(null),
        showExternal: this.fb.control(null),
        abandonTime: this.fb.control(null),
        sort: this.fb.array([]),
        ignoreDates: this.fb.group({
          from: this.fb.control(null),
          to: this.fb.control(null),
        })
      }),
      distribution: this.fb.group({
        users: this.fb.control(null),
        units: this.fb.control(null)
      })
    });
  }

  private setSubscriptions(): void {
    const sub = this.formGroup.get('production.dateType').valueChanges.subscribe(value => {
      const validators = value !== 'day' ? Validators.required : null;
      this.formGroup.get('production.dates').setValidators(validators);
      this.formGroup.get('production.dates').updateValueAndValidity();
    });

    this.sub.add(sub);
  }

  nextStep(): void {
    const formGroups = Object.keys(this.formGroup.value);
    const currentGroup = formGroups[this.currentStep - 1];

    if (this.formGroup.get(currentGroup).valid) {
      this.currentStep += 1;
    } else {
      const controls = (this.formGroup.get(currentGroup) as FormGroup).controls;
      Object.keys(controls).forEach(control => controls[control].markAsTouched());
    }
  }

  setDistributionControlValidation(controlName: string, notRequired: boolean): void {
    const validators = notRequired ? [] : Validators.required;
    this.formGroup.get('distribution.' + controlName).setValidators(validators);
    this.formGroup.get('distribution.' + controlName).updateValueAndValidity();
  }

  submit(): void {
    if (this.formGroup.valid && !this.isSubmitting) {
      this.isSubmitting = true;

      const values = this.formGroup.value;
      const spread = { ...values.general, ...values.production, ...values.criteria, ...values.distribution };
      spread.reportTemplate = spread.reportTemplate.id;
      spread.columns = spread.columns.map(column => column.id);
      spread.weekDays = Object.keys(spread.weekDays).filter(day => !!spread.weekDays[day]);

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

