import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BaseHttpService } from './base-http.service';

import { UserModel } from 'src/app/_shared/models/user.model';
import { TranslationModel } from 'src/app/_shared/models/translation.model';

@Injectable()
export class AppHttpService extends BaseHttpService {

  constructor(private http: HttpClient) {
    super();
  }

  login(username: string, password: string): Promise<UserModel> {
    return this.http.post(this.apiUrl + '/login', { username, password }, { headers: { noLoader: 'true' }})
      .toPromise()
      .then(response => response as UserModel)
      .catch(() => null);
  }

  logout(): Promise<boolean> {
    return this.http.post(this.apiUrl + '/logout', {}, { headers: { noLoader: 'true' }})
      .toPromise()
      .then(() => true)
      .catch(() => false);
  }

  forgotPassword(username: string): Promise<any> {
    return this.http.post(this.apiUrl + '/password/forgot', { username }, { headers: { noLoader: 'true' }})
      .toPromise()
      .then(() => true)
      .catch(response => response);
  }

  checkResetToken(token: string): Promise<any> {
    return this.http.post(this.apiUrl + '/password/checkToken', { token }, { headers: { noLoader: 'true' }})
      .toPromise()
      .then(() => true)
      .catch(response => response);
  }

  resetPassword(password: string, username: string, token: string): Promise<boolean> {
    return this.http.post(this.apiUrl + '/password/reset', { password, username, token })
      .toPromise()
      .then(() => true)
      .catch(() => false);
  }

  getTranslations(locale: string): Promise<TranslationModel[]> {
    return this.http.get('/assets/locale/' + locale + '.json')
      .toPromise()
      .then(response => response as TranslationModel[])
      .catch(() => undefined);
  }
}
