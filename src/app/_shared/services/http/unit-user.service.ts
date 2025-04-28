import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BaseHttpService } from './base-http.service';
import { UserSessionService } from '../state/user-session.service';

@Injectable()
export class UnitUserService extends BaseHttpService {

  readonly endPoint = this.apiUrl + '/unit';

  constructor(http: HttpClient, userSession: UserSessionService) {
    super(userSession, http);
  }

  getUsers(unitId: string): Promise<any> {
    return this.get<any>(`${this.endPoint}/${unitId}/user`, {
      fallback: null
    });
  }

  newUser(unitId: string, user: string): Promise<any> {
    return this.post<any>(`${this.endPoint}/${unitId}/user`, {
      body: { user },
      fallback: false
    });
  }
  
  deleteUser(unitId: string, user: string): Promise<boolean> {
    return this.delete<boolean>(`${this.endPoint}/${unitId}/user`, {
      params: { user },
      fallback: false
    });
  }
}
