import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BaseHttpService } from './base-http.service';
import { UserSessionService } from '../state/user-session.service';

import { SelectItemModel } from 'src/app/_shared/models/select-item.model';

@Injectable()
export class SelectService extends BaseHttpService {

  readonly endPoint = `${this.apiUrl}/select`;

  constructor(http: HttpClient, userSession: UserSessionService) {
    super(userSession, http);
  }

  select(resource: string, params?: object): Promise<SelectItemModel[]> {
    const values = { resource, ...params };
    
    return this.get<SelectItemModel[]>(this.endPoint, {
      params: values,
      noLoader: true,
      fallback: []
    });
  }

  routerForm(): Promise<object> {
    return this.get<object>(`${this.endPoint}/routerForm`);
  }

  acdForm(): Promise<object> {
    return this.get<object>(`${this.endPoint}/acdForm`);
  }

  groupExtensionForm(extensionGroup: number): Promise<object> {
    return this.get<object>(`${this.endPoint}/extensionGroup/${extensionGroup}`);
  }
}
