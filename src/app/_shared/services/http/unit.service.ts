import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { UserSessionService } from '../state/user-session.service';

import { UnitModel } from 'src/app/_shared/models/unit.model';
import { ResponseData } from 'src/app/_shared/constants/objects';
import { HttpGenericService } from './http-generic.service';

@Injectable()
export class UnitService extends HttpGenericService<UnitModel> {

  endpoint = 'unit';
  
  constructor(http: HttpClient, userSession: UserSessionService) {
    super(http, userSession);
  }

  getUnits(unitId?: string): Promise<UnitModel[]> {
    const params = unitId ? { unitId } : null;
    return this.getAll(params, true);
  }

  getUnit(unitId: string | 'root'): Promise<UnitModel> {
    return this.getOne(unitId);
  }

  newUnit(values: object): Promise<any> {
    return this.create(values);
  }

  updateUnit(unitId: string, values: object): Promise<ResponseData> {
    return this.update(unitId, values);
  }

  deleteUnit(unitId: string, assignedUnitId?: string): Promise<boolean> {
    const params = assignedUnitId ? { assignedUnitId } : null;
    return this.remove(unitId, params);
  }

  transferUnit(unit: string, parent: string): Promise<any> {
    return this.put<any>(`${this.apiUrl}/unit/${unit}/transfer`, {
      body: { parent },
      fallback: null
    });
  }

  getUnitLevels(): Promise<number[]> {
    return this.get<number[]>(`${this.apiUrl}/unit/levels`, {
      fallback: []
    });
  }
}
