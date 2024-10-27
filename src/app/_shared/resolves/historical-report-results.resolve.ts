import { Injectable } from '@angular/core';

import { HistoricalReportsService } from 'src/app/_shared/services/state/historical-reports.service';
import { ReportsService } from 'src/app/_shared/services/http/reports.service';

@Injectable()
export class HistoricalReportResultsResolve  {
  
  constructor(private reportsService: ReportsService,
              private reportStateService: HistoricalReportsService) {}

  resolve() {
    const criteria = this.reportStateService.getCriteria();
    return this.reportsService.getHistoricalResults(criteria);
  }
}
