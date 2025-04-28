import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BaseHttpService } from './base-http.service';
import { UserSessionService } from '../state/user-session.service';

import { ReportCriteriaModel } from 'src/app/_shared/models/report-criteria.model';

@Injectable()
export class ReportCriteriaService extends BaseHttpService {

  readonly endPoint = `${this.apiUrl}/reportCriteria`;

  constructor(http: HttpClient, userSession: UserSessionService) {
    super(userSession, http);
  }

  getReportCriteria(moduleId: number, name: string, userId: string): Promise<ReportCriteriaModel> {
    return this.get<ReportCriteriaModel>(this.endPoint, {
      params: { moduleId, name, userId }
    });
  }

  newReportCriteria(values: object, userId: string, name: string, module: number): Promise<boolean> {
    const body = { ...values, userId, name, module };
    return this.post<boolean>(this.endPoint, {
      body
    });
  }

  updateReportCriteria(reportCriteriaId: number, values: object): Promise<boolean> {
    return this.put<boolean>(`${this.endPoint}/${reportCriteriaId}`, {
      body: values
    });
  }

  deleteReportCriteria(reportCriteriaId: number): Promise<boolean> {
    return this.delete<boolean>(`${this.endPoint}/${reportCriteriaId}`);
  }
}
