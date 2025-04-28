import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BaseHttpService } from './base-http.service';
import { UserSessionService } from '../state/user-session.service';

import { SelectItemModel } from 'src/app/_shared/models/select-item.model';

@Injectable()
export class TagService extends BaseHttpService {

  readonly endPoint = `${this.apiUrl}/tag`;

  constructor(http: HttpClient, userSession: UserSessionService) {
    super(userSession, http);
  }

  getTags(type: string, existingTags: number[], keyword?: string): Promise<SelectItemModel[]> {
    const values = { type, existingTags: JSON.stringify(existingTags) }
    if (keyword) {
      Object.assign(values, { keyword });
    }

    return this.get<SelectItemModel[]>(this.endPoint, {
      params: values,
      noLoader: true,
      fallback: []
    });
  }
  
  newTag(type: string, name: string): Promise<SelectItemModel> {
    return this.post<SelectItemModel>(this.endPoint, {
      body: { type, name }
    });
  }
}
