import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';

import { UnitService } from 'src/app/_shared/services/http/unit.service';

import { UnitModel } from 'src/app/_shared/models/unit.model';

import { AppConstants } from '../constants/app.constants';

@Injectable()
export class UnitResolve  {

  constructor(private unitService: UnitService) {}

  async resolve(snapshot: ActivatedRouteSnapshot) {
    const unitId = snapshot.params.id;
    if (unitId === AppConstants.ROOT_UNIT_ID) {
      return null;
    }
    
    return this.unitService.getUnit(unitId).then(response => response as UnitModel);
  }
}
