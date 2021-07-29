import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BaseHttpService } from './base-http.service';
import { UserSessionService } from '../state/user-session.service';

import { DataTableResponse } from 'src/app/_shared/components/data-table/classes/data-table-response';
import { DataTableCriteria } from 'src/app/_shared/components/data-table/classes/data-table-criteria';
import { SelectItemModel } from 'src/app/_shared/models/select-item.model';

@Injectable()
export class CompanyService extends BaseHttpService {

  readonly endPoint = this.apiUrl + '/company';

  constructor(private http: HttpClient, userSession: UserSessionService) {
    super(userSession);
  }

  getCompanies(criteria: DataTableCriteria): Promise<DataTableResponse> {
    const params = this.getDataTableParams(criteria);

    return this.http.post(this.endPoint + '/search', params, this.getTokenRequest())
      .toPromise()
      .then(response => response as DataTableResponse)
      .catch(() => null);
  }

  updateCompany(companyId: number, values: object): Promise<boolean> {
    return this.http.put(this.endPoint + '/' + companyId, values, this.getTokenRequest())
      .toPromise()
      .then(() => true)
      .catch(() => false);
  }

  selectCompanies(): Promise<SelectItemModel[]> {
    return this.http.get(this.endPoint + '/select', this.getTokenRequest())
      .toPromise()
      .then(response => response as SelectItemModel[])
      .catch(() => []);
  }
}
