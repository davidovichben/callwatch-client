import { Injectable } from '@angular/core';


import { ReportTemplateService } from 'src/app/_shared/services/http/report-template.service';

import { ReportTemplateModel } from 'src/app/_shared/models/report-template.model';

@Injectable()
export class ReportTemplateSelectResolve  {

  constructor(private reportService: ReportTemplateService) {}

  resolve() {
    return this.reportService.selectReports().then(response => response as ReportTemplateModel[]);
  }
}
