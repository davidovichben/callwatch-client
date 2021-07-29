import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BaseHttpService } from './base-http.service';
import { UserSessionService } from '../state/user-session.service';

import { SelectItemModel } from 'src/app/_shared/models/select-item.model';

@Injectable()
export class GenericService extends BaseHttpService {

  constructor(private http: HttpClient, userSession: UserSessionService) {
    super(userSession);
  }

  selectEntities(companyId: number, type: string): Promise<SelectItemModel[]> {
    return this.http.get(this.apiUrl + '/select', this.getTokenRequest({ companyId, type }))
      .toPromise()
      .then(response => response as SelectItemModel[])
      .catch(() => []);
  }

  getCities(): Promise<SelectItemModel[]> {
    return this.http.get(this.apiUrl + '/city', this.getTokenRequest())
      .toPromise()
      .then(response => response as SelectItemModel[])
      .catch(() => []);
  }

  getCountries(): Promise<SelectItemModel[]> {
    return this.http.get(this.apiUrl + '/country', this.getTokenRequest())
      .toPromise()
      .then(response => response as SelectItemModel[])
      .catch(() => []);
  }

  getBanks(): Promise<SelectItemModel[]> {
    return this.http.get(this.apiUrl + '/bank', this.getTokenRequest())
      .toPromise()
      .then(response => response as SelectItemModel[])
      .catch(() => []);
  }

  getBankBranches(bankId: number): Promise<SelectItemModel[]> {
    return this.http.get(this.apiUrl + '/bank/' + bankId + '/branch', this.getTokenRequest())
      .toPromise()
      .then(response => response as SelectItemModel[])
      .catch(() => []);
  }

  getSummary(companyId: number): Promise<object[]> {
    return this.http.get(this.apiUrl + '/summary', this.getTokenRequest({ companyId }))
      .toPromise()
      .then(response => response as object[])
      .catch(() => []);
  }
}
