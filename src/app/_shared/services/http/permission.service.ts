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

  readonly endPoint = `${this.apiUrl}/permission`;

  constructor(http: HttpClient, userSession: UserSessionService) {
    super(userSession, http);
  }

  async getPermissions(criteria: DataTableCriteria): Promise<DataTableResponse> {
    const params = this.getDataTableParams(criteria);
    return this.post<DataTableResponse>(`${this.endPoint}/search`, {
      body: params
    });
  }

  async getPermission(permissionId: string): Promise<PermissionModel> {
    return this.get<PermissionModel>(`${this.endPoint}/${permissionId}`);
  }

  async newPermission(values: object): Promise<boolean> {
    return this.post<boolean>(this.endPoint, {
      body: values
    });
  }

  async updatePermission(permissionId: string, values: object): Promise<boolean> {
    return this.put<boolean>(`${this.endPoint}/${permissionId}`, {
      body: values
    });
  }

  async deletePermission(permissionId: string, newPermissionId?: string): Promise<boolean> {
    const params = newPermissionId ? { newPermissionId } : undefined;
    return this.delete<boolean>(`${this.endPoint}/${permissionId}`, {
      params
    });
  }
  
  async selectPermissions(): Promise<SelectItemModel[]> {
    return this.get<SelectItemModel[]>(`${this.endPoint}/select`, {
      fallback: []
    });
  }
  
  async permissionExists(name: string, idToIgnore?: string): Promise<{ exists: boolean }> {
    const params = { name };
    if (idToIgnore) {
      Object.assign(params, { idToIgnore });
    }
    
    return this.get<{ exists: boolean }>(`${this.endPoint}/exists`, {
      params,
      fallback: { exists: true }
    });
  }
}
