import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { UnitModel } from 'src/app/_shared/models/unit.model';

@Injectable({ providedIn: 'root' })

export class UnitStateService {

  refreshTree = new Subject<boolean>();
  unitTransferred = new Subject<UnitModel>();
  unitNameChanged = new Subject<UnitModel>();
}
