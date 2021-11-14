import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

import { UnitService } from 'src/app/_shared/services/http/unit.service';

import { UnitModel } from 'src/app/_shared/models/unit.model';

@Injectable()
export class UnitsSelectResolve implements Resolve<UnitModel[]> {

  constructor(private unitService: UnitService) {}

  resolve() {
    return this.unitService.getUnitsSelect().then(response => response as UnitModel[]);
  }
}
