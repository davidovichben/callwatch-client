import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { TranslateModule } from 'src/app/_shared/pipes/translate/translate.module';

import { UnitSelectComponent } from './unit-select.component';

@NgModule({
  declarations: [UnitSelectComponent],
	imports: [
    CommonModule,
    MatIconModule,
    MatCheckboxModule,
    TranslateModule
  ],
  exports: [UnitSelectComponent]
})
export class UnitSelectModule {}
