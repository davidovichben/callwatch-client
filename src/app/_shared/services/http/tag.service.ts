import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BaseHttpService } from './base-http.service';
import { UserSessionService } from '../state/user-session.service';

import { SelectItemModel } from 'src/app/_shared/models/select-item.model';

@Injectable()
export class TagService extends BaseHttpService {

  readonly endPoint = this.apiUrl + '/tag';

  constructor(private http: HttpClient, userSession: UserSessionService) {
    super(userSession);
  }

  getTags(type: string): Promise<SelectItemModel[]> {
    return this.http.get(this.endPoint, this.getTokenRequest({ type }, true))
      .toPromise()
      .then(response => response as SelectItemModel[])
      .catch(() => []);
  }

  newTag(type: string, name: string): Promise<SelectItemModel> {
    return this.http.post(this.endPoint, { type, name }, this.getTokenRequest())
      .toPromise()
      .then(response => response as SelectItemModel)
      .catch(() => null);
  }
}
