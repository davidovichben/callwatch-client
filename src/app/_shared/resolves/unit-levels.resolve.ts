import { Injectable } from '@angular/core';


import { UnitService } from 'src/app/_shared/services/http/unit.service';

@Injectable()
export class UnitLevelsResolve  {

  constructor(private unitService: UnitService) {}

  resolve() {
    return this.unitService.getUnitLevels().then(response => response);
  }
}
