import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BaseHttpService } from './base-http.service';
import { UserSessionService } from '../state/user-session.service';

import { OrganizationModel } from 'src/app/_shared/models/organization.model';

import { DataTableResponse } from 'src/app/_shared/components/data-table/classes/data-table-response';
import { DataTableCriteria } from 'src/app/_shared/components/data-table/classes/data-table-criteria';

@Injectable()
export class OrganizationService extends BaseHttpService {

  readonly endPoint = `${this.apiUrl}/organizations`;

  constructor(http: HttpClient, userSession: UserSessionService) {
    super(userSession, http);
  }

  getOrganizations(criteria: DataTableCriteria): Promise<DataTableResponse> {
    const params = this.getDataTableParams(criteria);
    return this.post<DataTableResponse>(`${this.endPoint}/search`, {
      body: params
    });
  }

  getOrganization(organizationId: string): Promise<OrganizationModel> {
    return this.get<OrganizationModel>(`${this.endPoint}/${organizationId}`);
  }

  newOrganization(values: object): Promise<boolean> {
    return this.post<boolean>(this.endPoint, {
      body: values
    });
  }

  updateOrganization(organizationId: string, values: object): Promise<boolean> {
    return this.put<boolean>(`${this.endPoint}/${organizationId}`, {
      body: values
    });
  }

  enterOrganization(organizationId: string): Promise<boolean> {
    return this.put<boolean>(`${this.endPoint}/${organizationId}/enter`, {
      body: {}
    });
  }
  
  getSettings(): Promise<any> {
    return this.get<any>(`${this.endPoint}/settings`, {
      fallback: {}
    });
  }
  
  updateSettings(settings: object): Promise<boolean> {
    return this.put<boolean>(`${this.endPoint}/settings`, {
      body: settings
    });
  }
}
