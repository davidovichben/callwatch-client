import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

import { UnitService } from 'src/app/_shared/services/http/unit.service';

@Injectable()
export class UnitLevelsResolve implements Resolve<number[]> {

  constructor(private unitService: UnitService) {}

  resolve() {
    return this.unitService.getUnitLevels().then(response => response);
  }
}
