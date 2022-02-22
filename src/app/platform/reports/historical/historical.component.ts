import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ReportTemplateService } from 'src/app/_shared/services/http/report-template.service';

import { SelectItemModel } from 'src/app/_shared/models/select-item.model';
import { ReportTemplateModel } from 'src/app/_shared/models/report-template.model';
import { UnitModel } from 'src/app/_shared/models/unit.model';

@Component({
  selector: 'app-historical',
  templateUrl: './historical.component.html',
  styleUrls: ['./historical.component.styl']
})
export class HistoricalComponent implements OnInit {

  modules: SelectItemModel[] = [];
  reportTemplates: ReportTemplateModel[] = [];

  activeModule: SelectItemModel;
  activeReport: ReportTemplateModel;

  units: UnitModel[] = [];
  results = null;

  isLoadingReports = true;

  isSubmitting = false;

  constructor(private route: ActivatedRoute, private reportService: ReportTemplateService) {}

  ngOnInit(): void {
    this.modules = this.route.snapshot.data.modules;
    this.units = this.route.snapshot.data.units;

    this.setActiveModule(this.modules[0]);
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

  submit(values: object): void {
    if (!this.isSubmitting && this.activeReport) {
      this.isSubmitting = true;

      this.reportService.produceReport(this.activeReport.id, values).then(response => {
        if (response) {
          this.results = response.results;
        }

        this.isSubmitting = false;
      })
    }
  }
}
