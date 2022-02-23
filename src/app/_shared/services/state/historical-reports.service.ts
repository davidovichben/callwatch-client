import { Injectable } from '@angular/core';

import { ReportTemplateModel } from 'src/app/_shared/models/report-template.model';
import { ReportCriteriaModel } from 'src/app/_shared/models/report-criteria.model';

@Injectable()
export class HistoricalReportsService {

  reportTemplate: ReportTemplateModel;

  dates: { start: string, end: string };

  setCriteria(values: ReportCriteriaModel): void {
    this.dates = values.dates;

    localStorage.setItem('report-criteria', JSON.stringify(values));
  }

  getCriteria(): ReportCriteriaModel {
    return JSON.parse(localStorage.getItem('report-criteria'));
  }
}
