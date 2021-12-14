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

  select(type: string): Promise<SelectItemModel[]> {
    return this.http.get(this.endPoint, this.getTokenRequest({ type }, true))
      .toPromise()
      .then(response => response as SelectItemModel[])
      .catch(() => []);
  }

  acdForm(): Promise<object> {
    return this.http.get(this.endPoint + '/acdForm', this.getTokenRequest())
      .toPromise()
      .then(response => response)
      .catch(() => null);
  }

  groupExtensionForm(): Promise<object> {
    return this.http.get(this.endPoint + '/extensionGroup', this.getTokenRequest())
      .toPromise()
      .then(response => response)
      .catch(() => null);
  }
}
