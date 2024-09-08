import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';

import { HistoricalReportsService } from 'src/app/_shared/services/state/historical-reports.service';
// import { ReportTemplateService } from 'src/app/_shared/services/http/report-template.service';
import { InsightsService } from '../services/http/insights.service';

@Injectable()
export class HistoricalReportResultsResolve  {
  
  constructor(private router: Router, private insightsService: InsightsService,
              private reportStateService: HistoricalReportsService) {}

  resolve(snapshot: ActivatedRouteSnapshot) {
    // const reportTemplate = this.reportStateService.getReportTemplate();
    // if (!reportTemplate) {
    //   this.router.navigate(['/platform', 'reports', 'historical', 'criteria']);
    //   return false;
    // }
    //
    const criteria = this.reportStateService.getCriteria();
    //
    // return this.reportService.produceReport(reportTemplate.id, values, snapshot.queryParams.page).then(response => response);
    
    return this.insightsService.getHistoricalInsights(criteria);
  }
}
