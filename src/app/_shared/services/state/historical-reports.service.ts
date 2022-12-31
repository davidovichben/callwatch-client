import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { ReportTemplateModel } from 'src/app/_shared/models/report-template.model';
import { ReportCriteriaModel } from 'src/app/_shared/models/report-criteria.model';

@Injectable()
export class HistoricalReportsService {

  reportTemplateChanged = new Subject();
  reportTemplate: ReportTemplateModel;

  dates: { start: string, end: string };

  setCriteria(values: ReportCriteriaModel): void {
    this.dates = values.dates;

    const criteria = this.getCriteria(true) ?? {};
    const module = this.reportTemplate.module;
    const name = this.reportTemplate.name;

    if (!criteria[module]) {
      criteria[module] = {};
      if (!criteria[module][name]) {
        criteria[module][name] = {};
      }
    }

    criteria[module][name] = values;

    localStorage.setItem('report-criteria', JSON.stringify(criteria));
  }

  getCriteria(all?: boolean): ReportCriteriaModel {
    const criteria = JSON.parse(localStorage.getItem('report-criteria'));

    if (!criteria) {
      return null;
    }

    if (all) {
      return criteria;
    }

    const template = this.reportTemplate;
    return criteria[template.module] ? criteria[template.module][template.name] : null;
  }

  setReportTemplate(reportTemplate: ReportTemplateModel): void {
    this.reportTemplate = reportTemplate;
    this.reportTemplateChanged.next(true);
  }

  getReportTemplate(): ReportTemplateModel {
    return this.reportTemplate;
  }
}
