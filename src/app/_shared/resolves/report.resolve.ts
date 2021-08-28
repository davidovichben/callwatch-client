import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';

import { ReportService } from 'src/app/_shared/services/http/report.service';

import { ReportModel } from 'src/app/_shared/models/report.model';

@Injectable()
export class ReportResolve implements Resolve<ReportModel> {

  constructor(private reportService: ReportService) {}

  resolve(snapshot: ActivatedRouteSnapshot) {
    return this.reportService.getReport(+snapshot.params.id).then(response => response as ReportModel);
  }
}
