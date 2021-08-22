import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BaseHttpService } from './base-http.service';
import { UserSessionService } from '../state/user-session.service';

import { GroupModel } from 'src/app/_shared/models/group.model';

import { DataTableResponse } from 'src/app/_shared/components/data-table/classes/data-table-response';
import { DataTableCriteria } from 'src/app/_shared/components/data-table/classes/data-table-criteria';
import { SelectItemModel } from 'src/app/_shared/models/select-item.model';

@Injectable()
export class GroupService extends BaseHttpService {

  readonly endPoint = this.apiUrl + '/group';

  constructor(private http: HttpClient, userSession: UserSessionService) {
    super(userSession);
  }

  getGroups(criteria: DataTableCriteria): Promise<DataTableResponse> {
    const params = this.getDataTableParams(criteria);

    return this.http.post(this.endPoint + '/search', params, this.getTokenRequest())
      .toPromise()
      .then(response => response as DataTableResponse)
      .catch(() => null);
  }

  getGroup(groupId: number): Promise<GroupModel> {
    return this.http.get(this.endPoint + '/' + groupId, this.getTokenRequest())
      .toPromise()
      .then(response => response as GroupModel)
      .catch(() => null);
  }

  newGroup(values: object): Promise<boolean> {
    return this.http.post(this.endPoint, values, this.getTokenRequest())
      .toPromise()
      .then(() => true)
      .catch(() => false);
  }

  updateGroup(groupId: number, values: object): Promise<boolean> {
    return this.http.put(this.endPoint + '/' + groupId, values, this.getTokenRequest())
      .toPromise()
      .then(() => true)
      .catch(() => false);
  }

  deleteGroup(groupId: number): Promise<boolean> {
    return this.http.delete(this.endPoint + '/' + groupId, this.getTokenRequest())
      .toPromise()
      .then(() => true)
      .catch(() => false);
  }

  selectGroups(): Promise<SelectItemModel[]> {
    return this.http.get(this.endPoint + '/select', this.getTokenRequest())
      .toPromise()
      .then(response => response as SelectItemModel[])
      .catch(() => []);
  }
}
