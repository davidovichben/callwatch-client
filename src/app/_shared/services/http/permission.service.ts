import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BaseHttpService } from './base-http.service';
import { UserSessionService } from '../state/user-session.service';

import { PermissionModel } from 'src/app/_shared/models/permission.model';

import { DataTableResponse } from 'src/app/_shared/components/data-table/classes/data-table-response';
import { DataTableCriteria } from 'src/app/_shared/components/data-table/classes/data-table-criteria';

@Injectable()
export class PermissionService extends BaseHttpService {

  readonly endPoint = this.apiUrl + '/permission';

  constructor(private http: HttpClient, userSession: UserSessionService) {
    super(userSession);
  }

  getPermissions(criteria: DataTableCriteria): Promise<DataTableResponse> {
    const params = this.getDataTableParams(criteria);

    return this.http.post(this.endPoint + '/search', params, this.getTokenRequest())
      .toPromise()
      .then(response => response as DataTableResponse)
      .catch(() => null);
  }

  getPermission(permissionId: number): Promise<PermissionModel> {
    return this.http.get(this.endPoint + '/' + permissionId, this.getTokenRequest())
      .toPromise()
      .then(response => response as PermissionModel)
      .catch(() => null);
  }

  newPermission(values: object): Promise<boolean> {
    return this.http.post(this.endPoint, values, this.getTokenRequest())
      .toPromise()
      .then(() => true)
      .catch(() => false);
  }

  updatePermission(permissionId: number, values: object): Promise<boolean> {
    return this.http.put(this.endPoint + '/' + permissionId, values, this.getTokenRequest())
      .toPromise()
      .then(() => true)
      .catch(() => false);
  }

  deletePermission(permissionId: number, newPermissionId?: number): Promise<boolean> {
    const params = {};
    if (newPermissionId) {
      Object.assign(params, { newPermissionId });
    }

    return this.http.delete(this.endPoint + '/' + permissionId, this.getTokenRequest(params))
      .toPromise()
      .then(() => true)
      .catch(() => false);
  }

  selectPermissions(): Promise<PermissionModel[]> {
    return this.http.get(this.endPoint + '/select', this.getTokenRequest())
      .toPromise()
      .then(response => response as PermissionModel[])
      .catch(() => []);
  }

}
