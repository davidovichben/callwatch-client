import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BaseHttpService } from './base-http.service';
import { UserSessionService } from '../state/user-session.service';

import { TranslationModel } from 'src/app/_shared/models/translation.model';

@Injectable()
export class GenericService extends BaseHttpService {

  constructor(private http: HttpClient, userSession: UserSessionService) {
    super(userSession);
  }

  getTranslations(lang: string): Promise<TranslationModel[]> {
    return this.http.get(this.apiUrl + '/translation', this.getTokenRequest({ lang }, true))
      .toPromise()
      .then(response => response as TranslationModel[])
      .catch(() => []);
  }

  exists(resource: string, value: string, ignoredId?: any, key?: string): Promise<{ exists: boolean }> {
    const values = { resource, value };
    if (ignoredId) {
      Object.assign(values, { ignore: ignoredId })
    }

    if (key) {
      Object.assign(values, { key })
    }

    return this.http.get(this.apiUrl + '/exists', this.getTokenRequest(values, true))
      .toPromise()
      .then(response => response as { exists: boolean })
      .catch(() => null);
  }
}
