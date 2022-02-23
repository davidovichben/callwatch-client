import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { ReportTemplateModel } from 'src/app/_shared/models/report-template.model';
import { ReportCriteriaModel } from 'src/app/_shared/models/report-criteria.model';

@Injectable()
export class HistoricalReportsService {

  reportTemplateChanged = new Subject();

  dates: { start: string, end: string };

  setCriteria(values: ReportCriteriaModel): void {
    this.dates = values.dates;

    localStorage.setItem('report-criteria', JSON.stringify(values));
  }

  getCriteria(): ReportCriteriaModel {
    return JSON.parse(localStorage.getItem('report-criteria'));
  }

  setReportTemplate(reportTemplate: ReportTemplateModel): void {
    localStorage.setItem('report-template', JSON.stringify(reportTemplate));
    this.reportTemplateChanged.next(true);
  }

  getReportTemplate(): ReportTemplateModel {
    return JSON.parse(localStorage.getItem('report-template'));
  }
}
