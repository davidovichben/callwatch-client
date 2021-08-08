import { Component, Input } from '@angular/core';

import { UnitModel } from 'src/app/_shared/models/unit.model';

@Component({
  selector: 'app-unit-block',
  templateUrl: './unit-block.component.html',
  styles: [`:host { display: flex }`]
})
export class UnitBlockComponent {
  @Input() units: UnitModel[] = [];
  @Input() parentId: number;
}
