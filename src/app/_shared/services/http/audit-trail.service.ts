import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BaseHttpService } from './base-http.service';
import { UserSessionService } from '../state/user-session.service';

import { DataTableCriteria } from 'src/app/_shared/components/data-table/classes/data-table-criteria';
import { DataTableResponse } from 'src/app/_shared/components/data-table/classes/data-table-response';
import { AuditTrailEntryChangeModel } from 'src/app/_shared/models/audit-trail-entry-change.model';

@Injectable()
export class AuditTrailService extends BaseHttpService {

  readonly endPoint = `${this.apiUrl}/auditTrail`;

  constructor(http: HttpClient, userSession: UserSessionService) {
    super(userSession, http);
  }

  getLogs(criteria: DataTableCriteria): Promise<DataTableResponse> {
    const params = this.getDataTableParams(criteria);
    return this.post<DataTableResponse>(`${this.endPoint}/search`, {
      body: params
    });
  }

  getChanges(entryId: number): Promise<AuditTrailEntryChangeModel[]> {
    return this.get<AuditTrailEntryChangeModel[]>(`${this.endPoint}/${entryId}/changes`);
  }
}
