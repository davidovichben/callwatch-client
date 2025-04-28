import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';

import { UserSessionService } from '../state/user-session.service';

import { DataTableCriteria } from 'src/app/_shared/components/data-table/classes/data-table-criteria';

export interface HttpOptions<T> {
  params?: any;
  noLoader?: boolean;
  fallback?: T;
}

export interface HttpBodyOptions<T> extends HttpOptions<T> {
  body: any;
}

@Injectable()
export abstract class BaseHttpService {

  readonly apiUrl = environment.apiUrl;

  protected constructor(protected userSession?: UserSessionService, protected http?: HttpClient) {}

  getTokenRequest(params?: any, noLoader?: boolean): { headers: HttpHeaders, params?: HttpParams } {
    const request: { headers: HttpHeaders, params?: HttpParams } = { headers: this.getTokenHeaders(noLoader) };

    if (params) {
      request.params = new HttpParams({ fromObject: params } );
    }

    return request;
  }

  getTokenHeaders(noLoader?: boolean): HttpHeaders {
    const headers = {
      Authorization: 'Bearer ' + this.userSession.getToken()
    };

    if (noLoader) {
      Object.assign(headers, { NoLoader: 'true' });
    }

    return new HttpHeaders(headers);
  }

  getBlobRequest(params?: any): { headers: HttpHeaders, responseType: 'blob' } {
    const request: { headers: HttpHeaders, responseType: 'blob', params?: HttpParams } = {
      headers: this.getTokenHeaders(),
      responseType: 'blob'
    };

    if (params) {
      request.params = new HttpParams({ fromObject: params } );
    }

    return request;
  }

  getDataTableParams(criteria: DataTableCriteria, params?: object): object {
    const formattedParams = {
      ...criteria.filters,
      ...params,
      sortBy: criteria.sort.column,
      sortDir: criteria.sort.direction,
      page: criteria.page,
      keyword: '',
      isCheckAll: false
    };

    if (criteria.keyword) {
      formattedParams.keyword = criteria.keyword;
    }

    if (criteria.isCheckAll) {
      formattedParams.isCheckAll = criteria.isCheckAll;
    }

    return formattedParams;
  }

  protected handleResponse<T>(response: any): T {
    return response as T;
  }

  protected handleError<T>(error: any, fallback: T): T {
    console.error('API Error:', error);
    return fallback;
  }

  protected get<T>(endpoint: string, options?: HttpOptions<T>): Promise<T> {
    const opts: HttpOptions<T> = {
      params: null,
      noLoader: false,
      fallback: null,
      ...options
    };

    return this.http.get(endpoint, this.getTokenRequest(opts.params, opts.noLoader))
      .toPromise()
      .then(response => this.handleResponse<T>(response))
      .catch(error => this.handleError<T>(error, opts.fallback));
  }

  protected post<T>(endpoint: string, options: HttpBodyOptions<T>): Promise<T> {
    const opts: HttpBodyOptions<T> = {
      body: null,
      params: null,
      noLoader: false,
      fallback: false as unknown as T,
      ...options
    };
  
    return this.http.post(endpoint, opts.body, this.getTokenRequest(opts.params, opts.noLoader))
      .toPromise()
      .then(response => this.handleResponse<T>(response))
      .catch(error => this.handleError<T>(error, opts.fallback));
  }
  
  protected put<T>(endpoint: string, options: HttpBodyOptions<T>): Promise<T> {
    const opts: HttpBodyOptions<T> = {
      body: null,
      params: null,
      noLoader: false,
      fallback: false as unknown as T,
      ...options
    };
  
    return this.http.put(endpoint, opts.body, this.getTokenRequest(opts.params, opts.noLoader))
      .toPromise()
      .then(response => this.handleResponse<T>(response))
      .catch(error => this.handleError<T>(error, opts.fallback));
  }
  
  protected delete<T>(endpoint: string, options?: HttpOptions<T>): Promise<T> {
    const opts: HttpOptions<T> = {
      params: null,
      noLoader: false,
      fallback: false as unknown as T,
      ...options
    };

    return this.http.delete(endpoint, this.getTokenRequest(opts.params, opts.noLoader))
      .toPromise()
      .then(response => this.handleResponse<T>(response))
      .catch(error => this.handleError<T>(error, opts.fallback));
  }

  protected getBlob(endpoint: string, params?: any): Promise<Blob> {
    return this.http.get(endpoint, this.getBlobRequest(params))
      .toPromise()
      .then(response => response as Blob)
      .catch(() => null);
  }
}
