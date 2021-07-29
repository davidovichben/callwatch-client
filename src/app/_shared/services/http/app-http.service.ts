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

  getTranslations(lang: string): Promise<TranslationModel[]> {
    return this.http.get('/assets/lang/' + lang + '.json')
      .toPromise()
      .then(response => response as TranslationModel[])
      .catch(() => undefined);
  }
}
