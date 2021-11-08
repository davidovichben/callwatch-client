import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BaseHttpService } from './base-http.service';
import { UserSessionService } from '../state/user-session.service';

import { DataTableResponse } from 'src/app/_shared/components/data-table/classes/data-table-response';
import { DataTableCriteria } from 'src/app/_shared/components/data-table/classes/data-table-criteria';
import { SelectItemModel } from 'src/app/_shared/models/select-item.model';
import { UserModel } from 'src/app/_shared/models/user.model';

@Injectable()
export class UserService extends BaseHttpService {

  readonly endPoint = this.apiUrl + '/user';

  constructor(private http: HttpClient, userSession: UserSessionService) {
    super(userSession);
  }

  getUsers(criteria: DataTableCriteria): Promise<DataTableResponse> {
    const params = this.getDataTableParams(criteria);

    return this.http.post(this.endPoint + '/search', params, this.getTokenRequest(null, true))
      .toPromise()
      .then(response => response as DataTableResponse)
      .catch(() => null);
  }

  getUser(userId: number): Promise<UserModel> {
    return this.http.get(this.endPoint + '/' + userId, this.getTokenRequest())
      .toPromise()
      .then(response => response as UserModel)
      .catch(() => null);
  }

  newUser(values: object): Promise<boolean> {
    return this.http.post(this.endPoint, values, this.getTokenRequest())
      .toPromise()
      .then(() => true)
      .catch(() => false);
  }

  updateUser(userId: number, values: object): Promise<any> {
    return this.http.put(this.endPoint + '/' + userId, values, this.getTokenRequest())
      .toPromise()
      .then(response => response)
      .catch(() => false);
  }

  deleteUser(userId: number): Promise<boolean> {
    return this.http.delete(this.endPoint + '/' + userId, this.getTokenRequest())
      .toPromise()
      .then(() => true)
      .catch(() => false);
  }

  selectUsers(): Promise<SelectItemModel[]> {
    return this.http.get(this.endPoint + '/select', this.getTokenRequest())
      .toPromise()
      .then(response => response as SelectItemModel[])
      .catch(() => []);
  }

  getPermissions(): Promise<any> {
    return this.http.get(this.endPoint + '/permission', this.getTokenRequest())
      .toPromise()
      .then(response => response)
      .catch(() => null);
  }

  checkExists(username: string): Promise<any> {
    return this.http.get(this.endPoint + '/exists', this.getTokenRequest({ username }, true))
      .toPromise()
      .then(response => response)
      .catch(() => false);
  }
}
