import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BaseHttpService } from './base-http.service';
import { UserSessionService } from '../state/user-session.service';

import { SelectItemModel } from 'src/app/_shared/models/select-item.model';

@Injectable()
export class GenericService extends BaseHttpService {

  constructor(private http: HttpClient, userSession: UserSessionService) {
    super(userSession);
  }

  select(type: string): Promise<SelectItemModel[]> {
    return this.http.get(this.apiUrl + '/select', this.getTokenRequest({ type }, true))
      .toPromise()
      .then(response => response as SelectItemModel[])
      .catch(() => []);
  }

}
