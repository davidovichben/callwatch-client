import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BaseHttpService } from './base-http.service';
import { UserSessionService } from '../state/user-session.service';

import { SelectItemModel } from 'src/app/_shared/models/select-item.model';

@Injectable()
export class SelectService extends BaseHttpService {

  readonly endPoint = this.apiUrl + '/select';

  constructor(private http: HttpClient, userSession: UserSessionService) {
    super(userSession);
  }

  select(resource: string, params?: object): Promise<SelectItemModel[]> {
    const values = { resource };
    if (params) {
      Object.assign(values, { ...params })
    }

    return this.http.get(this.endPoint, this.getTokenRequest(values, true))
      .toPromise()
      .then(response => response as SelectItemModel[])
      .catch(() => []);
  }

  routerForm(): Promise<object> {
    return this.http.get(this.endPoint + '/routerForm', this.getTokenRequest())
      .toPromise()
      .then(response => response)
      .catch(() => null);
  }

  acdForm(): Promise<object> {
    return this.http.get(this.endPoint + '/acdForm', this.getTokenRequest())
      .toPromise()
      .then(response => response)
      .catch(() => null);
  }

  groupExtensionForm(extensionGroup: number): Promise<object> {
    return this.http.get(this.endPoint + '/extensionGroup/' + extensionGroup, this.getTokenRequest())
      .toPromise()
      .then(response => response)
      .catch(() => null);
  }
}
