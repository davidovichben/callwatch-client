import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BaseHttpService } from './base-http.service';
import { UserSessionService } from '../state/user-session.service';

import { SelectItemModel } from 'src/app/_shared/models/select-item.model';

@Injectable()
export class PermissionEntityService extends BaseHttpService {

  readonly endPoint = this.apiUrl + '/permissionEntity';

  constructor(private http: HttpClient, userSession: UserSessionService) {
    super(userSession);
  }

  getPermissionEntities(): Promise<{ groups: SelectItemModel[], users: SelectItemModel[]}> {
    return this.http.get(this.endPoint, this.getTokenRequest())
      .toPromise()
      .then(response => response as { groups: SelectItemModel[], users: SelectItemModel[]})
      .catch(() => null);
  }
}
