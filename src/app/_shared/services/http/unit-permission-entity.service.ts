import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BaseHttpService } from './base-http.service';
import { UserSessionService } from '../state/user-session.service';

import { PermissionEntityModel } from 'src/app/_shared/models/permission-entity.model';

@Injectable()
export class UnitPermissionEntityService extends BaseHttpService {

  readonly endPoint = this.apiUrl + '/unit';

  constructor(private http: HttpClient, userSession: UserSessionService) {
    super(userSession);
  }

  getPermissionEntities(unitId: number, type: string): Promise<PermissionEntityModel[]> {
    return this.http.get(this.endPoint + '/' + unitId + '/permissionEntity', this.getTokenRequest({ type }))
      .toPromise()
      .then(response => response as PermissionEntityModel[])
      .catch(() => []);
  }

  newPermissionEntity(unitId: number, permissionEntityId: number): Promise<any> {
    return this.http.post(this.endPoint + '/' + unitId + '/permissionEntity', { permissionEntityId }, this.getTokenRequest())
      .toPromise()
      .then(() => true)
      .catch(response => response);
  }

  deletePermissionEntity(unitId: number, permissionEntityId: number): Promise<boolean> {
    return this.http.delete(this.endPoint + '/permissionEntity/' + permissionEntityId, this.getTokenRequest())
      .toPromise()
      .then(() => true)
      .catch(() => false);
  }
}
