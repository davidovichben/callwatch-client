import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BaseHttpService } from './base-http.service';
import { UserSessionService } from '../state/user-session.service';

import { UnitModel } from 'src/app/_shared/models/unit.model';

@Injectable()
export class UnitService extends BaseHttpService {

  readonly endPoint = this.apiUrl + '/unit';

  constructor(private http: HttpClient, userSession: UserSessionService) {
    super(userSession);
  }

  getUnits(unitId?: number): Promise<UnitModel[]> {
    const params = {};
    if (unitId) {
      Object.assign(params, { unitId });
    }

    return this.http.get(this.endPoint, this.getTokenRequest(params, true))
      .toPromise()
      .then(response => response as UnitModel[])
      .catch(() => []);
  }

  getUnit(unitId: number | 'root'): Promise<UnitModel> {
    return this.http.get(this.endPoint + '/' + unitId, this.getTokenRequest())
      .toPromise()
      .then(response => response as UnitModel)
      .catch(() => null);
  }

  newUnit(values: object): Promise<any> {
    return this.http.post(this.endPoint, values, this.getTokenRequest())
      .toPromise()
      .then(() => true)
      .catch(() => false);
  }

  updateUnit(unitId: number, values: object): Promise<boolean> {
    return this.http.put(this.endPoint + '/' + unitId, values, this.getTokenRequest(null, true))
      .toPromise()
      .then(() => true)
      .catch(() => false);
  }

  transferUnit(unitId: number, parentId: number): Promise<any> {
    return this.http.put(this.endPoint + '/transfer', { unitId, parentId }, this.getTokenRequest())
      .toPromise()
      .then(() => true)
      .catch(response => response);
  }

  deleteUnit(unitId: number, assignedUnitId?: number): Promise<boolean> {
    const params = {};
    if (assignedUnitId) {
      Object.assign(params, { assignedUnitId });
    }

    return this.http.delete(this.endPoint + '/' + unitId, this.getTokenRequest(params))
      .toPromise()
      .then(() => true)
      .catch(() => false);
  }
}
