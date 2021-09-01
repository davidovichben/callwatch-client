import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { TranslateModule } from 'src/app/_shared/pipes/translate/translate.module';

import { UnitTreeSelectComponent } from './unit-tree-select.component';

@NgModule({
  declarations: [UnitTreeSelectComponent],
  imports: [
    CommonModule,
    MatCheckboxModule,
    TranslateModule
  ],
  exports: [UnitTreeSelectComponent]
})
export class UnitTreeSelectModule {}
