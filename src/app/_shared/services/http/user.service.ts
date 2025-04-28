import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BaseHttpService } from './base-http.service';
import { UserSessionService } from '../state/user-session.service';

import { DataTableResponse } from 'src/app/_shared/components/data-table/classes/data-table-response';
import { DataTableCriteria } from 'src/app/_shared/components/data-table/classes/data-table-criteria';
import { UserModel } from 'src/app/_shared/models/user.model';

@Injectable()
export class UserService extends BaseHttpService {

  readonly endPoint = `${this.apiUrl}/user`;
  
  constructor(http: HttpClient, userSession: UserSessionService) {
    super(userSession, http);
  }

  getUsers(criteria: DataTableCriteria): Promise<DataTableResponse> {
    const params = this.getDataTableParams(criteria);
    return this.post<DataTableResponse>(`${this.endPoint}/search`, {
      body: params,
      noLoader: true
    });
  }

  getUser(userId: string): Promise<UserModel> {
    return this.get<UserModel>(`${this.endPoint}/${userId}`);
  }
  
  newUser(values: object): Promise<boolean> {
    return this.post<boolean>(this.endPoint, {
      body: values
    });
  }

  updateUser(userId: string, values: object): Promise<any> {
    return this.put<any>(`${this.endPoint}/${userId}`, {
      body: values
    });
  }

  multipleUpdate(checkedItems: any[], values: object): Promise<boolean> {
    return this.put<boolean>(`${this.endPoint}/multipleUpdate`, {
      body: { checkedItems, ...values }
    });
  }

  deleteUser(userId: string): Promise<boolean> {
    return this.delete<boolean>(`${this.endPoint}/${userId}`);
  }

  getPermissions(): Promise<any> {
    return this.get<any>(`${this.endPoint}/permission`);
  }

  checkExists(username: string): Promise<boolean> {
    return this.get<boolean>(`${this.endPoint}/exists`, {
      params: { username },
      noLoader: true
    });
  }
}
