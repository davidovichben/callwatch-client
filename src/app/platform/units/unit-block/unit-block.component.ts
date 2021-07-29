import { Component, Input } from '@angular/core';

import { UnitModel } from 'src/app/_shared/models/unit.model';

@Component({
  selector: 'app-unit-block',
  templateUrl: './unit-block.component.html',
  styleUrls: ['./unit-block.component.styl']
})
export class UnitBlockComponent {
  @Input() units: UnitModel[] = [];
  @Input() parentId: number;
}
