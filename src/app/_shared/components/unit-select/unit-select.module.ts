import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslateModule } from 'src/app/_shared/pipes/translate/translate.module';

import { UnitSelectComponent } from './unit-select.component';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [UnitSelectComponent],
  imports: [CommonModule, MatIconModule, TranslateModule],
  exports: [UnitSelectComponent]
})
export class UnitSelectModule {}
