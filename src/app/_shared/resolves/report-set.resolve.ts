import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';

import { ReportSetService } from 'src/app/_shared/services/http/report-set.service';

import { ReportSetModel } from 'src/app/_shared/models/report-set.model';

@Injectable()
export class ReportSetResolve implements Resolve<ReportSetModel> {

  constructor(private reportSetService: ReportSetService) {}

  resolve(snapshot: ActivatedRouteSnapshot) {
    return this.reportSetService.getReportSet(+snapshot.params.id).then(response => response as ReportSetModel);
  }
}
