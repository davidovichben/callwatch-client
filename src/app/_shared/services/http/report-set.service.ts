import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BaseHttpService } from './base-http.service';
import { UserSessionService } from '../state/user-session.service';

import { ReportSetModel } from 'src/app/_shared/models/report-set.model';
import { DataTableResponse } from 'src/app/_shared/components/data-table/classes/data-table-response';
import { DataTableCriteria } from 'src/app/_shared/components/data-table/classes/data-table-criteria';

@Injectable()
export class ReportSetService extends BaseHttpService {

  readonly endPoint = this.apiUrl + '/reportSet';

  constructor(private http: HttpClient, userSession: UserSessionService) {
    super(userSession);
  }

  getReportSets(criteria: DataTableCriteria): Promise<DataTableResponse> {
    const params = this.getDataTableParams(criteria);

    return this.http.post(this.endPoint + '/search', params, this.getTokenRequest())
      .toPromise()
      .then(response => response as DataTableResponse)
      .catch(() => null);
  }

  getReportSet(reportSetId: number): Promise<ReportSetModel> {
    return this.http.get(this.endPoint + '/' + reportSetId, this.getTokenRequest())
      .toPromise()
      .then(response => response as ReportSetModel)
      .catch(() => null);
  }

  newReportSet(values: object): Promise<boolean> {
    return this.http.post(this.endPoint, values, this.getTokenRequest())
      .toPromise()
      .then(() => true)
      .catch(() => false);
  }

  updateReportSet(reportSetId: number, values: object): Promise<boolean> {
    return this.http.put(this.endPoint + '/' + reportSetId, values, this.getTokenRequest())
      .toPromise()
      .then(() => true)
      .catch(() => false);
  }

  deleteReportSet(reportSetId: number): Promise<boolean> {
    return this.http.delete(this.endPoint + '/' + reportSetId, this.getTokenRequest())
      .toPromise()
      .then(() => true)
      .catch(() => false);
  }
}
