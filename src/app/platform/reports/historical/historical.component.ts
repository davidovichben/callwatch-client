import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ReportTemplateService } from 'src/app/_shared/services/http/report-template.service';
import { HistoricalReportsService } from 'src/app/_shared/services/state/historical-reports.service';

import { SelectItemModel } from 'src/app/_shared/models/select-item.model';
import { ReportTemplateModel } from 'src/app/_shared/models/report-template.model';

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

  isLoadingReports = true;

  constructor(private route: ActivatedRoute, private reportService: ReportTemplateService,
              private reportStateService: HistoricalReportsService) {}

  ngOnInit(): void {
    this.modules = this.route.snapshot.data.modules;

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
      this.setActiveReport(this.reportTemplates[0]);
    })
  }

  setActiveReport(report: ReportTemplateModel): void {
    this.activeReport = report;
    this.reportStateService.reportTemplate = report;
  }
}
