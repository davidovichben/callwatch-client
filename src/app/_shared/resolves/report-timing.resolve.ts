import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';

import { ReportTimingService } from 'src/app/_shared/services/http/report-timing.service';

import { ReportTimingModel } from 'src/app/_shared/models/report-timing.model';

@Injectable()
export class ReportTimingResolve  {

  constructor(private reportTimingService: ReportTimingService) {}

  resolve(snapshot: ActivatedRouteSnapshot) {
    return this.reportTimingService.getReportTiming(+snapshot.params.id).then(response => response as ReportTimingModel);
  }
}
