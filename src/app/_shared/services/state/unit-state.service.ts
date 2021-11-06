import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { UnitModel } from 'src/app/_shared/models/unit.model';

@Injectable({ providedIn: 'root' })

export class UnitStateService {

  unitNameChanged = new Subject<UnitModel>();
}
