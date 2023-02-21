import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BaseHttpService } from './base-http.service';
import { UserSessionService } from '../state/user-session.service';

import { ReportCriteriaModel } from 'src/app/_shared/models/report-criteria.model';

@Injectable()
export class ReportCriteriaService extends BaseHttpService {

  readonly endPoint = this.apiUrl + '/reportCriteria';

  constructor(private http: HttpClient, userSession: UserSessionService) {
    super(userSession);
  }

  getReportCriteria(moduleId: number, name: string, userId: number): Promise<ReportCriteriaModel> {
    return this.http.get(this.endPoint, this.getTokenRequest({ moduleId, name, userId }))
      .toPromise()
      .then(response => response as ReportCriteriaModel)
      .catch(() => null);
  }

  newReportCriteria(values: object, userId: number, name: string, module: number): Promise<boolean> {
    Object.assign(values, { userId, name, module })
    return this.http.post(this.endPoint, values, this.getTokenRequest())
      .toPromise()
      .then(() => true)
      .catch(() => false);
  }

  updateReportCriteria(reportCriteriaId: number, values: object): Promise<boolean> {
    return this.http.put(this.endPoint + '/' + reportCriteriaId, values, this.getTokenRequest())
      .toPromise()
      .then(() => true)
      .catch(() => false);
  }

  deleteReportCriteria(reportCriteriaId: number): Promise<boolean> {
    return this.http.delete(this.endPoint + '/' + reportCriteriaId, this.getTokenRequest())
      .toPromise()
      .then(() => true)
      .catch(() => false);
  }
}
