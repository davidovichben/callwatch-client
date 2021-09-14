import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { UnitSelectComponent } from './unit-select.component';

@NgModule({
  declarations: [UnitSelectComponent],
	imports: [CommonModule, MatIconModule, MatCheckboxModule],
  exports: [UnitSelectComponent]
})
export class UnitSelectModule {}
