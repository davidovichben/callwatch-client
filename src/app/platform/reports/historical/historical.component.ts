import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

import { ReportTemplateService } from 'src/app/_shared/services/http/report-template.service';

import { SelectItemModel } from 'src/app/_shared/models/select-item.model';
import { SortDirections, WeekDays } from 'src/app/_shared/constants/general';
import { AbandonTimes, TimeSpaces } from 'src/app/_shared/constants/report';
import { ReportTemplateModel } from 'src/app/_shared/models/report-template.model';
import { UnitModel } from 'src/app/_shared/models/unit.model';

@Component({
  selector: 'app-historical',
  templateUrl: './historical.component.html',
  styleUrls: ['./historical.component.styl']
})
export class HistoricalComponent implements OnInit {

  readonly weekDays = WeekDays;
  readonly abandonTimes = AbandonTimes;
  readonly timeSpaces = TimeSpaces;
  readonly sortDirections = SortDirections;

  modules: SelectItemModel[] = [];
  reportTemplates: ReportTemplateModel[] = [];
  units: UnitModel[] = [];

  activeModule: SelectItemModel;
  activeReport: ReportTemplateModel;

  isLoadingReports = true;

  formGroup: FormGroup;

  isSubmitting = false;

  constructor(private route: ActivatedRoute, private fb: FormBuilder,
              private reportService: ReportTemplateService) {}

  ngOnInit(): void {
    this.modules = this.route.snapshot.data.modules;
    this.units = this.route.snapshot.data.units;

    this.setActiveModule(this.modules[0]);

    this.makeForm();
  }

  private makeForm(): void {
    this.formGroup = this.fb.group({
      times: this.fb.array([]),
      weekDays: this.fb.group({}),
      callingNumber: this.fb.control(null),
      calledNumber: this.fb.control(null),
      showInternal: this.fb.control(null),
      showExternal: this.fb.control(null),
      abandonTime: this.fb.control(null),
      timeSpace: this.fb.control(null),
      sort: this.fb.array([])
    });

    this.addTime();
    this.addSortColumn();

    this.weekDays.forEach(day => {
      const control = this.fb.control(false);
      (this.formGroup.get('weekDays') as FormGroup).addControl(day, control);
    });
  }

  setActiveModule(module: SelectItemModel): void {
    if (this.activeModule && this.activeModule.id === module.id) {
      return;
    }

    this.isLoadingReports = true;

    this.activeModule = module;

    this.reportService.getReportByModule(module.id).then(response => {
      this.isLoadingReports = false;

      this.reportTemplates = response;
      this.activeReport = this.reportTemplates[0];
    })
  }

  addTime(): void {
    const group = this.fb.group({
      startTime: this.fb.control(null),
      endTime: this.fb.control(null)
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
    if (!this.isSubmitting && this.activeReport) {
      this.isSubmitting = true;
      this.reportService.produceReport(this.activeReport.id, this.formGroup.value).then(response => {
        console.log(response)
        this.isSubmitting = false;
      })
    }
  }
}
