import { Injectable } from '@angular/core';
import { Resolve, Router } from '@angular/router';

import { HistoricalReportsService } from 'src/app/_shared/services/state/historical-reports.service';
import { ReportTemplateService } from 'src/app/_shared/services/http/report-template.service';

@Injectable()
export class HistoricalReportResultsResolve implements Resolve<any> {

  constructor(private router: Router, private reportService: ReportTemplateService,
              private reportStateService: HistoricalReportsService) {}

  resolve() {
    if (!this.reportStateService.reportTemplate) {
      this.router.navigate(['/platform', 'reports', 'historical', 'criteria']);
      return false;
    }

    const reportTemplateId = this.reportStateService.reportTemplate.id;

    const values = this.reportStateService.getCriteria();
    values.weekDays = Object.keys(values.weekDays).filter(day => !!values.weekDays[day]);

    return this.reportService.produceReport(reportTemplateId, values).then(response => response);
  }
}
