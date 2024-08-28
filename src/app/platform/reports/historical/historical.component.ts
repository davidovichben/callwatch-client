import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ReportTemplateService } from 'src/app/_shared/services/http/report-template.service';
import { HistoricalReportsService } from 'src/app/_shared/services/state/historical-reports.service';

import { SelectItemModel } from 'src/app/_shared/models/select-item.model';
import { ReportTemplateModel } from 'src/app/_shared/models/report-template.model';

@Component({
  selector: 'app-historical',
  templateUrl: './historical.component.html',
  styleUrls: ['./historical.component.sass']
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
    // this.modules = this.route.snapshot.data.modules;
    // this.setActiveModule(this.modules[0]);
  }

  async setActiveModule(module: SelectItemModel): Promise<void> {
    if (this.activeModule && this.activeModule._id === module._id) {
      return;
    }

    this.isLoadingReports = true;

    this.activeModule = module;

    const response = await this.reportService.getReportTemplatesByModule(module._id);
    this.isLoadingReports = false;

    this.reportTemplates = response;

    if (this.reportTemplates.length > 0 && !this.activeReport) {
      this.setActiveReport(this.reportTemplates[0]);
    }
  }

  setActiveReport(reportTemplate: ReportTemplateModel): void {
    this.activeReport = reportTemplate;

    this.reportStateService.setReportTemplate(reportTemplate);

    this.router.navigate(['/platform', 'reports', 'historical', 'criteria']);
  }
}
