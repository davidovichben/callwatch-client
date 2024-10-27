import { Injectable } from '@angular/core';

import { ReportsService } from 'src/app/_shared/services/http/reports.service';

@Injectable()
export class ReportColumnsResolve  {
  
  constructor(private reportsService: ReportsService) {}

  resolve() {
    return this.reportsService.getColumns();
  }
}
