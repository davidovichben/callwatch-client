import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { UnitModel } from 'src/app/_shared/models/unit.model';

@Injectable({ providedIn: 'root' })

export class UnitStateService {

  subject = new Subject<UnitModel>();

  changeUnit(unit: UnitModel): void {
    this.subject.next(unit);
  }
}
