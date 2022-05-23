import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { ReportTemplateModel } from 'src/app/_shared/models/report-template.model';
import { ReportCriteriaModel } from 'src/app/_shared/models/report-criteria.model';

@Injectable()
export class HistoricalReportsService {

  reportTemplateChanged = new Subject();
  reportTemplate: ReportTemplateModel;

  dates: { from: string, to: string };

  setCriteria(values: ReportCriteriaModel): void {
    this.dates = values.dates;

    localStorage.setItem('report-criteria', JSON.stringify(values));
  }

  getCriteria(): ReportCriteriaModel {
    return JSON.parse(localStorage.getItem('report-criteria'));
  }

  setReportTemplate(reportTemplate: ReportTemplateModel): void {
    this.reportTemplate = reportTemplate;
    this.reportTemplateChanged.next(true);
  }

  getReportTemplate(): ReportTemplateModel {
    return this.reportTemplate;
  }
}
