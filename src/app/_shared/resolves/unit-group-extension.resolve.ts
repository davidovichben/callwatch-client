import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';

import { UnitService } from 'src/app/_shared/services/http/unit.service';

import { UnitModel } from 'src/app/_shared/models/unit.model';

@Injectable()
export class UnitGroupExtensionResolve implements Resolve<UnitModel> {

  constructor(private unitService: UnitService) {}

  resolve(snapshot: ActivatedRouteSnapshot) {
    const unitId = snapshot.parent.parent.params.id;
    return this.unitService.getExtensionGroup(unitId).then(response => response as UnitModel);
  }
}
