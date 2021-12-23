import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BaseHttpService } from './base-http.service';
import { UserSessionService } from '../state/user-session.service';

import { OrganizationModel } from 'src/app/_shared/models/organization.model';

import { DataTableResponse } from 'src/app/_shared/components/data-table/classes/data-table-response';
import { DataTableCriteria } from 'src/app/_shared/components/data-table/classes/data-table-criteria';

@Injectable()
export class OrganizationService extends BaseHttpService {

  readonly endPoint = this.apiUrl + '/organization';

  constructor(private http: HttpClient, userSession: UserSessionService) {
    super(userSession);
  }

  getOrganizations(criteria: DataTableCriteria): Promise<DataTableResponse> {
    const params = this.getDataTableParams(criteria);

    return this.http.post(this.endPoint + '/search', params, this.getTokenRequest())
      .toPromise()
      .then(response => response as DataTableResponse)
      .catch(() => null);
  }

  getOrganization(organizationId: number): Promise<OrganizationModel> {
    return this.http.get(this.endPoint + '/' + organizationId, this.getTokenRequest())
      .toPromise()
      .then(response => response as OrganizationModel)
      .catch(() => null);
  }

  newOrganization(values: object): Promise<boolean> {
    return this.http.post(this.endPoint, values, this.getTokenRequest())
      .toPromise()
      .then(() => true)
      .catch(() => false);
  }

  updateOrganization(organizationId: number, values: object): Promise<boolean> {
    return this.http.put(this.endPoint + '/' + organizationId, values, this.getTokenRequest())
      .toPromise()
      .then(() => true)
      .catch(() => false);
  }

  enterOrganization(organizationId: number): Promise<boolean> {
    return this.http.put(this.endPoint + '/' + organizationId + '/enter', {}, this.getTokenRequest())
      .toPromise()
      .then(() => true)
      .catch(() => false);
  }
}
