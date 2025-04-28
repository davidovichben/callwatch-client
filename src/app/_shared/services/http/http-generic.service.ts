import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserSessionService } from '../state/user-session.service';
import { BaseHttpService } from './base-http.service';
import { DataTableResponse } from '../../components/data-table/classes/data-table-response';
import { DataTableCriteria } from '../../components/data-table/classes/data-table-criteria';

@Injectable()
export class HttpGenericService<T> extends BaseHttpService {
  protected endpoint: string;
  
  constructor(
    protected override http: HttpClient,
    protected override userSession: UserSessionService
  ) {
    super(userSession, http);
  }

  getAll(params?: any, noLoader = false): Promise<T[]> {
    return this.get<T[]>(`${this.apiUrl}/${this.endpoint}`, {
      params,
      noLoader,
      fallback: []
    });
  }

  getOne(id: string, params?: any, noLoader = false): Promise<T> {
    return this.get<T>(`${this.apiUrl}/${this.endpoint}/${id}`, {
      params,
      noLoader,
      fallback: null
    });
  }

  create(entity: any, params?: any, noLoader = false): Promise<T> {
    return this.post<T>(`${this.apiUrl}/${this.endpoint}`, {
      body: entity,
      params,
      noLoader,
      fallback: null
    });
  }

  update(id: string, entity: any, params?: any, noLoader = true): Promise<any> {
    return this.put<any>(`${this.apiUrl}/${this.endpoint}/${id}`, {
      body: entity,
      params,
      noLoader,
      fallback: false
    });
  }

  remove(id: string, params?: any, noLoader = false): Promise<boolean> {
    return this.delete<boolean>(`${this.apiUrl}/${this.endpoint}/${id}`, {
      params,
      noLoader,
      fallback: false
    });
  }

  search(criteria: DataTableCriteria): Promise<DataTableResponse> {
    const params = this.getDataTableParams(criteria);
    return this.post<DataTableResponse>(`${this.apiUrl}/${this.endpoint}/search`, {
      body: params,
      fallback: null
    });
  }
  
  exists(value: string, ignoredId?: string, key?: string): Promise<{ exists: boolean }> {
    const params = {
      resource: this.endpoint,
      value
    };
    
    if (ignoredId) {
      Object.assign(params, { ignore: ignoredId });
    }
    
    if (key) {
      Object.assign(params, { key });
    }
    
    return this.get<{ exists: boolean }>(`${this.apiUrl}/exists`, {
      params,
      noLoader: true,
      fallback: { exists: false }
    });
  }
}
