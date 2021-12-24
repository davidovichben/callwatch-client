import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BaseHttpService } from './base-http.service';
import { UserSessionService } from '../state/user-session.service';

@Injectable()
export class GenericService extends BaseHttpService {

  constructor(private http: HttpClient, userSession: UserSessionService) {
    super(userSession);
  }

  exists(resource: string, value: string, key?: string): Promise<{ exists: boolean }> {
    const values = { resource, value };
    if (key) {
      Object.assign(values, { key })
    }

    return this.http.get(this.apiUrl + '/exists', this.getTokenRequest(values, true))
      .toPromise()
      .then(response => response as { exists: boolean })
      .catch(() => null);
  }
}
