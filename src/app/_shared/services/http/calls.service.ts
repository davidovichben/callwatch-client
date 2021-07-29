import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BaseHttpService } from 'src/app/_shared/services/http/base-http.service';
import { UserSessionService } from 'src/app/_shared/services/state/user-session.service';

import { DataTableCriteria } from 'src/app/_shared/components/data-table/classes/data-table-criteria';
import { DataTableResponse } from 'src/app/_shared/components/data-table/classes/data-table-response';

@Injectable()
export class CallsService extends BaseHttpService {

  readonly endPoint = this.apiUrl + '/call';

  constructor(private http: HttpClient, userSession: UserSessionService) {
    super(userSession);
  }

  getCalls(criteria: DataTableCriteria, entityId: number, entityType: string): Promise<DataTableResponse> {
    const params = this.getDataTableParams(criteria, { entityType, entityId });

    return this.http.post(this.endPoint + '/search', params, this.getTokenRequest())
      .toPromise()
      .then(response => response as DataTableResponse)
      .catch(() => null);
  }

  newCall(entityId: number, entityType: string, values: any): Promise<any> {
    Object.assign(values, { entityId, entityType });
    return this.http.post(this.endPoint, values, this.getTokenRequest())
      .toPromise()
      .then(() => true)
      .catch(() => false);
  }

  updateCall(callId: number, values: object): Promise<boolean> {
    return this.http.put(this.endPoint + '/' + callId, values, this.getTokenRequest())
      .toPromise()
      .then(() => true)
      .catch(() => false);
  }

  deleteCall(callId: number): Promise<boolean> {
    return this.http.delete(this.endPoint + '/' + callId, this.getTokenRequest())
      .toPromise()
      .then(() => true)
      .catch(() => false);
  }
}
