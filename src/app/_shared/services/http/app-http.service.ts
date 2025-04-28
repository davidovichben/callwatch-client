import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { BaseHttpService } from './base-http.service';

import { UserModel } from 'src/app/_shared/models/user.model';

@Injectable()
export class AppHttpService extends BaseHttpService {

  constructor(protected override http: HttpClient) {
    super(null, http);
  }
  
  login(username: string, password: string): Promise<any> {
    const headers = new HttpHeaders({ noLoader: 'true' });
    return this.http.post(this.apiUrl + '/login', { username, password }, { headers })
      .toPromise()
      .then(response => response as UserModel)
      .catch(response => response);
  }

  logout(): Promise<boolean> {
    return this.post<boolean>(`${this.apiUrl}/logout`, {
      body: {},
      noLoader: true
    });
  }
  
  forgotPassword(username: string): Promise<any> {
    return this.post<any>(`${this.apiUrl}/password/forgot`, {
      body: { username },
      noLoader: true
    });
  }
  
  checkResetToken(token: string): Promise<any> {
    return this.post<any>(`${this.apiUrl}/password/checkToken`, {
      body: { token },
      noLoader: true
    });
  }
  
  resetPassword(password: string, username: string, token: string): Promise<boolean> {
    return this.post<boolean>(`${this.apiUrl}/password/reset`, {
      body: { password, username, token }
    });
  }
  
  test(): Promise<boolean> {
    return this.get<boolean>(`${this.apiUrl}/test`, {
        fallback: false // Note: This is not a search method, so keeping false
    });
  }
}
