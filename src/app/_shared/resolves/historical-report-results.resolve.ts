import { Injectable } from '@angular/core';
import { Resolve, Router } from '@angular/router';

import { HistoricalReportsService } from 'src/app/_shared/services/state/historical-reports.service';
import { ReportTemplateService } from 'src/app/_shared/services/http/report-template.service';

@Injectable()
export class HistoricalReportResultsResolve implements Resolve<any> {

  constructor(private router: Router, private reportService: ReportTemplateService,
              private reportStateService: HistoricalReportsService) {}

  resolve() {
    const reportTemplate = this.reportStateService.getReportTemplate();
    if (!reportTemplate) {
      this.router.navigate(['/platform', 'reports', 'historical', 'criteria']);
      return false;
    }

    const values = this.reportStateService.getCriteria();

    return this.reportService.produceReport(reportTemplate.id, values).then(response => response);
  }
}
