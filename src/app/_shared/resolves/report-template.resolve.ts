import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';

import { ReportTemplateService } from 'src/app/_shared/services/http/report-template.service';

import { ReportTemplateModel } from 'src/app/_shared/models/report-template.model';

@Injectable()
export class ReportTemplateResolve implements Resolve<ReportTemplateModel> {

  constructor(private reportService: ReportTemplateService) {}

  resolve(snapshot: ActivatedRouteSnapshot) {
    return this.reportService.getReport(+snapshot.params.id).then(response => response as ReportTemplateModel);
  }
}
