import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BaseHttpService } from './base-http.service';
import { UserSessionService } from '../state/user-session.service';

import { DataTableResponse } from 'src/app/_shared/components/data-table/classes/data-table-response';
import { DataTableCriteria } from 'src/app/_shared/components/data-table/classes/data-table-criteria';

@Injectable()
export class ExceptionsService extends BaseHttpService {

  readonly endPoint = this.apiUrl + '/exception';

  constructor(private http: HttpClient, userSession: UserSessionService) {
    super(userSession);
  }

  getExceptions(criteria: DataTableCriteria): Promise<DataTableResponse> {
    const params = this.getDataTableParams(criteria);

    return this.http.post(this.endPoint + '/search', params, this.getTokenRequest())
      .toPromise()
      .then(response => response as DataTableResponse)
      .catch(() => null);
  }

  deleteException(exceptionId: number): Promise<boolean> {
    return this.http.delete(this.endPoint + '/' + exceptionId, this.getTokenRequest())
      .toPromise()
      .then(() => true)
      .catch(() => false);
  }
}
