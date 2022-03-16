import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BaseHttpService } from './base-http.service';
import { UserSessionService } from '../state/user-session.service';

import { DataTableCriteria } from 'src/app/_shared/components/data-table/classes/data-table-criteria';
import { DataTableResponse } from 'src/app/_shared/components/data-table/classes/data-table-response';
import { AuditTrailEntryChangeModel } from 'src/app/_shared/models/audit-trail-entry-change.model';

@Injectable()
export class AuditTrailService extends BaseHttpService {

  readonly endPoint = this.apiUrl + '/auditTrail';

  constructor(private http: HttpClient, userSession: UserSessionService) {
    super(userSession);
  }

  getLogs(criteria: DataTableCriteria): Promise<DataTableResponse> {
    const params = this.getDataTableParams(criteria);

    return this.http.post(this.endPoint + '/search', params, this.getTokenRequest())
      .toPromise()
      .then(response => response as DataTableResponse)
      .catch(() => null);
  }

  getChanges(entryId: number): Promise<AuditTrailEntryChangeModel[]> {
    return this.http.get(this.endPoint + '/' + entryId + '/changes', this.getTokenRequest())
      .toPromise()
      .then(response => response as AuditTrailEntryChangeModel[])
      .catch(() => null);
  }
}
