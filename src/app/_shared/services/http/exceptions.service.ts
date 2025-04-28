import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BaseHttpService } from './base-http.service';
import { UserSessionService } from '../state/user-session.service';

import { DataTableResponse } from 'src/app/_shared/components/data-table/classes/data-table-response';
import { DataTableCriteria } from 'src/app/_shared/components/data-table/classes/data-table-criteria';

@Injectable()
export class ExceptionsService extends BaseHttpService {

  readonly endPoint = this.apiUrl + '/exception';

  constructor(http: HttpClient, userSession: UserSessionService) {
    super(userSession, http);
  }

  getExceptions(criteria: DataTableCriteria): Promise<DataTableResponse> {
    const params = this.getDataTableParams(criteria);
    return this.post<DataTableResponse>(`${this.endPoint}/search`, {
      body: params
    });
  }

  deleteException(exceptionId: number): Promise<boolean> {
    return this.delete<boolean>(`${this.endPoint}/${exceptionId}`);
  }
}
