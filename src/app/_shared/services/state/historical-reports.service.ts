import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { UserSessionService } from 'src/app/_shared/services/state/user-session.service';

import { ReportTemplateModel } from 'src/app/_shared/models/report-template.model';
import { ReportCriteriaModel } from 'src/app/_shared/models/report-criteria.model';

@Injectable()
export class HistoricalReportsService {

  reportTemplateChanged = new Subject();
  reportTemplate: ReportTemplateModel;

  dates: { start: string, end: string };

  userId: number;

  constructor(private userService: UserSessionService) {
    this.userId = this.userService.getUserId();
  }

  setCriteria(values: ReportCriteriaModel): void {
    this.dates = values.dates;

    const criteriaIndexByUser = this.getCriteria(true) ?? {};
    const criteria = criteriaIndexByUser[this.userId] ? criteriaIndexByUser[this.userId] : {};

    const module = this.reportTemplate.module;
    const name = this.reportTemplate.name;

    if (!criteria[module]) {
      criteria[module] = {};
      if (!criteria[module][name]) {
        criteria[module][name] = {};
      }
    }

    criteria[module][name] = values;
    criteriaIndexByUser[this.userId] = criteria

    localStorage.setItem('report-criteria', JSON.stringify(criteriaIndexByUser));
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
    if (criteria[this.userId]) {
      return criteria[this.userId][template.module] ? criteria[this.userId][template.module][template.name] : null;
    }

    return null;
  }

  setReportTemplate(reportTemplate: ReportTemplateModel): void {
    this.reportTemplate = reportTemplate;
    this.reportTemplateChanged.next(true);
  }

  getReportTemplate(): ReportTemplateModel {
    return this.reportTemplate;
  }
}
