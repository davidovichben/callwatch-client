import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BaseHttpService } from './base-http.service';
import { UserSessionService } from '../state/user-session.service';

import { SelectItemModel } from 'src/app/_shared/models/select-item.model';
import { DataTableCriteria } from 'src/app/_shared/components/data-table/classes/data-table-criteria';
import { DataTableResponse } from 'src/app/_shared/components/data-table/classes/data-table-response';
import { ReportModel } from 'src/app/_shared/models/report.model';

@Injectable()
export class ReportService extends BaseHttpService {

  readonly endPoint = this.apiUrl + '/report';

  constructor(private http: HttpClient, userSession: UserSessionService) {
    super(userSession);
  }

  getReports(criteria: DataTableCriteria): Promise<DataTableResponse> {
    const params = this.getDataTableParams(criteria);

    return this.http.post(this.endPoint + '/search', params, this.getTokenRequest())
      .toPromise()
      .then(response => response as DataTableResponse)
      .catch(() => null);
  }

  getReport(reportId: number): Promise<ReportModel> {
    return this.http.get(this.endPoint + '/' + reportId, this.getTokenRequest())
      .toPromise()
      .then(response => response as ReportModel)
      .catch(() => null);
  }

  newReport(values: object): Promise<boolean> {
    return this.http.post(this.endPoint, values, this.getTokenRequest())
      .toPromise()
      .then(() => true)
      .catch(() => false);
  }

  updateReport(reportId: number, values: object): Promise<boolean> {
    return this.http.put(this.endPoint + '/' + reportId, values, this.getTokenRequest())
      .toPromise()
      .then(() => true)
      .catch(() => false);
  }

  deleteReport(reportId: number): Promise<boolean> {
    return this.http.delete(this.endPoint + '/' + reportId, this.getTokenRequest())
      .toPromise()
      .then(() => true)
      .catch(() => false);
  }

  selectReports(): Promise<SelectItemModel[]> {
    return this.http.get(this.endPoint + '/select', this.getTokenRequest())
      .toPromise()
      .then(response => response as SelectItemModel[])
      .catch(() => []);
  }
}
