import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BaseHttpService } from './base-http.service';
import { UserSessionService } from '../state/user-session.service';

import { SelectItemModel } from 'src/app/_shared/models/select-item.model';

@Injectable()
export class ReportService extends BaseHttpService {

  readonly endPoint = this.apiUrl + '/report';

  constructor(private http: HttpClient, userSession: UserSessionService) {
    super(userSession);
  }

  getTypes(): Promise<SelectItemModel[]> {
    return this.http.get(this.endPoint + '/type', this.getTokenRequest())
      .toPromise()
      .then(response => response as SelectItemModel[])
      .catch(() => []);
  }
}
