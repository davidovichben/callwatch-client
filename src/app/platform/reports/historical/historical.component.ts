import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

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

  constructor(private route: ActivatedRoute, private router: Router,
              private reportService: ReportTemplateService,
              private reportStateService: HistoricalReportsService) {}

  ngOnInit(): void {
    this.modules = this.route.snapshot.data.modules;
    let activeModule = this.modules[0];

    const reportTemplate = this.reportStateService.getReportTemplate();
    if (reportTemplate) {
      activeModule = this.modules.find(module => module.id === reportTemplate.module);
      this.activeReport = reportTemplate;
    }

    this.setActiveModule(activeModule);
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

      if (this.reportTemplates.length > 0 && !this.activeReport) {
        this.setActiveReport(this.reportTemplates[0]);
      }
    })
  }

  setActiveReport(reportTemplate: ReportTemplateModel): void {
    this.activeReport = reportTemplate;
    if (this.activeReport.unitLevels) {
      this.activeReport.unitLevels.forEach(level => {
        this.activeReport.columns.push({ id: 'level_' + level, level });
      });
    }

    this.reportStateService.setReportTemplate(reportTemplate);

    this.router.navigate(['/platform', 'reports', 'historical', 'criteria']);
  }
}
