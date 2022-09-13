import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { UnitSelectModule } from 'src/app/_shared/components/unit-select/unit-select.module';
import { CheckedItemsModule } from 'src/app/_shared/components/multiple-edit/checked-items/checked-items.module';
import { BdSelectModule } from 'src/app/_shared/components/bd-select/bd-select.module';
import { TranslateModule } from 'src/app/_shared/pipes/translate/translate.module';

import { MultipleEditComponent } from './multiple-edit.component';

@NgModule({
  declarations: [MultipleEditComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatSelectModule,
    TranslateModule,
    CheckedItemsModule,
    UnitSelectModule,
    MatCheckboxModule,
    BdSelectModule
  ],
  exports: [MultipleEditComponent]
})
export class MultipleEditModule {}
