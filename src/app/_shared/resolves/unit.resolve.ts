import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';

import { UnitService } from 'src/app/_shared/services/http/unit.service';

import { UnitModel } from 'src/app/_shared/models/unit.model';

@Injectable()
export class UnitResolve  {

  constructor(private unitService: UnitService) {}

  async resolve(snapshot: ActivatedRouteSnapshot) {
    const unitId = snapshot.params.id;
    
    const unit = await this.unitService.getUnit(unitId).then(response => response as UnitModel);
    console.log(unit)
    
    return this.unitService.getUnit(unitId).then(response => response as UnitModel);
  }
}
