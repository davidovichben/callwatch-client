import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BaseHttpService } from './base-http.service';
import { UserSessionService } from '../state/user-session.service';

import { PermissionModel } from 'src/app/_shared/models/permission.model';

import { DataTableResponse } from 'src/app/_shared/components/data-table/classes/data-table-response';
import { DataTableCriteria } from 'src/app/_shared/components/data-table/classes/data-table-criteria';
import { SelectItemModel } from '../../models/select-item.model';

@Injectable()
export class PermissionService extends BaseHttpService {

  readonly endPoint = this.apiUrl + '/permission';

  constructor(private http: HttpClient, userSession: UserSessionService) {
    super(userSession);
  }

  async getPermissions(criteria: DataTableCriteria): Promise<DataTableResponse> {
    const params = this.getDataTableParams(criteria);
    
    try {
      const response = await this.http.post(this.endPoint + '/search', params, this.getTokenRequest())
        .toPromise();
      return response as DataTableResponse;
    } catch {
      return null;
    }
  }

  async getPermission(permissionId: string): Promise<PermissionModel> {
    try {
      const response = await this.http.get(this.endPoint + '/' + permissionId, this.getTokenRequest())
        .toPromise();
      return response as PermissionModel;
    } catch {
      return null;
    }
  }

  async newPermission(values: object): Promise<boolean> {
    try {
      await this.http.post(this.endPoint, values, this.getTokenRequest())
        .toPromise();
      return true;
    } catch {
      return false;
    }
  }

  async updatePermission(permissionId: string, values: object): Promise<boolean> {
    try {
      await this.http.put(this.endPoint + '/' + permissionId, values, this.getTokenRequest())
        .toPromise();
      return true;
    } catch {
      return false;
    }
  }

  async deletePermission(permissionId: string, newPermissionId?: string): Promise<boolean> {
    const params = {};
    if (newPermissionId) {
      Object.assign(params, { newPermissionId });
    }
    
    try {
      await this.http.delete(this.endPoint + '/' + permissionId, this.getTokenRequest(params)).toPromise();
      return true;
    } catch {
      return false;
    }
  }
  
  async selectPermissions(): Promise<SelectItemModel[]> {
    try {
      const response = await this.http.get(this.endPoint + '/select', this.getTokenRequest())
        .toPromise();
      return response as SelectItemModel[];
    } catch {
      return [];
    }
  }
  
  async permissionExists(name: string, idToIgnore?: string): Promise<{ exists: boolean }> {
    try {
      const params = { name };
      if (idToIgnore) {
        Object.assign(params, { idToIgnore });
      }
      
      const response = await this.http.get(this.endPoint + '/exists', this.getTokenRequest(params))
        .toPromise();
      return response as { exists: boolean };
    } catch {
      return { exists: true }
    }
  }
}
