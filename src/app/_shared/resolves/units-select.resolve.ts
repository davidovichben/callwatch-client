import { Injectable } from '@angular/core';


import { UnitService } from 'src/app/_shared/services/http/unit.service';

import { UnitModel } from 'src/app/_shared/models/unit.model';

@Injectable()
export class UnitsSelectResolve  {

  constructor(private unitService: UnitService) {}

  resolve() {
    return this.unitService.getUnits().then(response => response as UnitModel[]);
  }
}
