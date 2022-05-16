import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BaseHttpService } from './base-http.service';
import { UserSessionService } from '../state/user-session.service';

import { UnitModel } from 'src/app/_shared/models/unit.model';
import { ResponseData } from 'src/app/_shared/constants/objects';

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
      .then(response => response)
      .catch(() => false);
  }

  updateUnit(unitId: number, values: object): Promise<ResponseData> {
    return this.http.put(this.endPoint + '/' + unitId, values, this.getTokenRequest(null, true))
      .toPromise()
      .then(response => response as ResponseData)
      .catch(() => null);
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

  transferUnit(unit: number, parent: number): Promise<any> {
    return this.http.put(this.endPoint + '/' + unit + '/transfer', { parent }, this.getTokenRequest())
      .toPromise()
      .then(() => true)
      .catch(response => response);
  }
}
