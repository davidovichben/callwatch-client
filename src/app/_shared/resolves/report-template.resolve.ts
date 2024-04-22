import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';

import { ReportTemplateService } from 'src/app/_shared/services/http/report-template.service';

import { ReportTemplateModel } from 'src/app/_shared/models/report-template.model';

@Injectable()
export class ReportTemplateResolve  {

  constructor(private reportService: ReportTemplateService) {}

  resolve(snapshot: ActivatedRouteSnapshot) {
    return this.reportService.getReport(+snapshot.params.id).then(response => response as ReportTemplateModel);
  }
}
