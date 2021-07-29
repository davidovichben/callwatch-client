import { Injectable } from '@angular/core';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';

import { UserSessionService } from '../state/user-session.service';

import { DataTableCriteria } from 'src/app/_shared/components/data-table/classes/data-table-criteria';

@Injectable()
export abstract class BaseHttpService {

  readonly apiUrl = environment.apiUrl;

  protected constructor(protected userSession?: UserSessionService) {}

  getTokenRequest(params?: any): { headers: HttpHeaders, params?: HttpParams } {
    const request: { headers: HttpHeaders, params?: HttpParams } = { headers: this.getTokenHeaders() };
    if (params) {
      request.params = new HttpParams({ fromObject: params } );
    }

    return request;
  }

  getTokenHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: 'Bearer ' + this.userSession.getToken()
    });
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
}
