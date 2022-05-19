import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BaseHttpService } from './base-http.service';
import { UserSessionService } from '../state/user-session.service';

import { DataTableCriteria } from 'src/app/_shared/components/data-table/classes/data-table-criteria';
import { DataTableResponse } from 'src/app/_shared/components/data-table/classes/data-table-response';
import { ReportTemplateModel } from 'src/app/_shared/models/report-template.model';

@Injectable()
export class ReportTemplateService extends BaseHttpService {

  readonly endPoint = this.apiUrl + '/reportTemplate';

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

  getReport(reportId: number): Promise<ReportTemplateModel> {
    return this.http.get(this.endPoint + '/' + reportId, this.getTokenRequest())
      .toPromise()
      .then(response => response as ReportTemplateModel)
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

  selectReports(): Promise<ReportTemplateModel[]> {
    return this.http.get(this.endPoint + '/select', this.getTokenRequest())
      .toPromise()
      .then(response => response as ReportTemplateModel[])
      .catch(() => []);
  }

  getReportByModule(module: number): Promise<ReportTemplateModel[]> {
    return this.http.get(this.endPoint + '/byModule', this.getTokenRequest({ module }))
      .toPromise()
      .then(response => response as ReportTemplateModel[])
      .catch(() => []);
  }

  produceReport(reportTemplateId: number, criteria: object, page?: number): Promise<any> {
    const params = {};
    if (page) {
      params['page'] = page;
    }

    return this.http.post(this.endPoint + '/' + reportTemplateId + '/produce', criteria, this.getTokenRequest(params))
      .toPromise()
      .then(response => (response as any).results)
      .catch(() => null);
  }

  exportReport(reportTemplateId: number, criteria: object, format: string): Promise<any> {
    return this.http.post(this.endPoint + '/' + reportTemplateId + '/export', criteria, this.getBlobRequest({ format }))
      .toPromise()
      .then(response => response)
      .catch(() => null);
  }
}
