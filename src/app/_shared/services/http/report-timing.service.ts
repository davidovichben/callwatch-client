import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BaseHttpService } from './base-http.service';
import { UserSessionService } from '../state/user-session.service';

import { DataTableCriteria } from 'src/app/_shared/components/data-table/classes/data-table-criteria';
import { DataTableResponse } from 'src/app/_shared/components/data-table/classes/data-table-response';
import { ReportTimingModel } from 'src/app/_shared/models/report-timing.model';

@Injectable()
export class ReportTimingService extends BaseHttpService {

  readonly endPoint = this.apiUrl + '/reportTiming';

  constructor(private http: HttpClient, userSession: UserSessionService) {
    super(userSession);
  }

  getReportTimings(criteria: DataTableCriteria): Promise<DataTableResponse> {
    const params = this.getDataTableParams(criteria);

    return this.http.post(this.endPoint + '/search', params, this.getTokenRequest())
      .toPromise()
      .then(response => response as DataTableResponse)
      .catch(() => null);
  }

  getReportTiming(reportTimingId: number): Promise<ReportTimingModel> {
    return this.http.get(this.endPoint + '/' + reportTimingId, this.getTokenRequest())
      .toPromise()
      .then(response => response as ReportTimingModel)
      .catch(() => null);
  }

  newReportTiming(values: object): Promise<boolean> {
    return this.http.post(this.endPoint, values, this.getTokenRequest())
      .toPromise()
      .then(() => true)
      .catch(() => false);
  }

  updateReportTiming(reportTimingId: number, values: object): Promise<boolean> {
    return this.http.put(this.endPoint + '/' + reportTimingId, values, this.getTokenRequest())
      .toPromise()
      .then(() => true)
      .catch(() => false);
  }

  deleteReportTiming(reportTimingId: number): Promise<boolean> {
    return this.http.delete(this.endPoint + '/' + reportTimingId, this.getTokenRequest())
      .toPromise()
      .then(() => true)
      .catch(() => false);
  }
}
