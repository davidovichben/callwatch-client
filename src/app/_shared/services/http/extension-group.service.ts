import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BaseHttpService } from './base-http.service';
import { UserSessionService } from '../state/user-session.service';

import { ExtensionGroupModel } from 'src/app/_shared/models/extension-group.model';

@Injectable()
export class ExtensionGroupService extends BaseHttpService {

  readonly endPoint = this.apiUrl + '/unit';

  constructor(private http: HttpClient, userSession: UserSessionService) {
    super(userSession);
  }

  getExtensionGroup(unitId: number): Promise<ExtensionGroupModel> {
    return this.http.get(this.endPoint + '/' + unitId + '/extensionGroup', this.getTokenRequest())
      .toPromise()
      .then(response => response as ExtensionGroupModel)
      .catch(() => null);
  }

  updateExtensionGroup(unitId: number, values: object): Promise<boolean> {
    return this.http.put(this.endPoint + '/' + unitId + '/extensionGroup', values, this.getTokenRequest())
      .toPromise()
      .then(() => true)
      .catch(() => false);
  }
}
