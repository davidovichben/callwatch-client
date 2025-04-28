import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BaseHttpService } from './base-http.service';
import { UserSessionService } from '../state/user-session.service';

import { TranslationModel } from 'src/app/_shared/models/translation.model';

@Injectable()
export class MiscService extends BaseHttpService {

  constructor(protected override http: HttpClient, userSession: UserSessionService) {
    super(userSession, http);
  }

  getTranslations(lang: string): Promise<TranslationModel[]> {
    return this.get<TranslationModel[]>(`${this.apiUrl}/translation`, {
      params: { lang },
      noLoader: true,
      fallback: []
    });
  }
  
  exists(resource: string, value: string, ignoredId?: any, key?: string): Promise<{ exists: boolean }> {
    const params = { resource, value };
    if (ignoredId) {
      Object.assign(params, { ignore: ignoredId });
    }
    
    if (key) {
      Object.assign(params, { key });
    }
    
    return this.get<{ exists: boolean }>(`${this.apiUrl}/exists`, {
      params,
      noLoader: true
    });
  }
}
