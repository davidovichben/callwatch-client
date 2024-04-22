import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';

import { UnitService } from 'src/app/_shared/services/http/unit.service';

import { UnitModel } from 'src/app/_shared/models/unit.model';

@Injectable()
export class UnitResolve  {

  constructor(private unitService: UnitService) {}

  resolve(snapshot: ActivatedRouteSnapshot) {
    const unitId = snapshot.params.id;
    return this.unitService.getUnit(unitId).then(response => response as UnitModel);
  }
}
