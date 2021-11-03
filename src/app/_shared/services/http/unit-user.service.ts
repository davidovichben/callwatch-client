import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BaseHttpService } from './base-http.service';
import { UserSessionService } from '../state/user-session.service';

@Injectable()
export class UnitUserService extends BaseHttpService {

  readonly endPoint = this.apiUrl + '/unit';

  constructor(private http: HttpClient, userSession: UserSessionService) {
    super(userSession);
  }

  getUsers(unitId: number): Promise<any> {
    return this.http.get(this.endPoint + '/' + unitId + '/user', this.getTokenRequest())
      .toPromise()
      .then(response => response as any)
      .catch(() => null);
  }

  newUser(unitId: number, userId: number): Promise<any> {
    return this.http.post(this.endPoint + '/' + unitId + '/user', { userId }, this.getTokenRequest())
      .toPromise()
      .then(() => true)
      .catch(response => response);
  }

  deleteUser(unitId: number, userId: number): Promise<boolean> {
    return this.http.delete(this.endPoint + '/' + unitId + '/user', this.getTokenRequest({ userId }))
      .toPromise()
      .then(() => true)
      .catch(() => false);
  }
}
