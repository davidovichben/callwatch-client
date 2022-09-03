import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { UnitSelectModule } from 'src/app/_shared/components/unit-select/unit-select.module';
import { CheckedItemsModule } from 'src/app/_shared/components/multiple-edit/checked-items/checked-items.module';
import { BdSelectModule } from 'src/app/_shared/components/bd-select/bd-select.module';
import { TranslateModule } from 'src/app/_shared/pipes/translate/translate.module';
import { TruncateModule } from 'src/app/_shared/pipes/truncate/truncate.module';

import { MultipleEditComponent } from './multiple-edit.component';


@NgModule({
  declarations: [MultipleEditComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatIconModule,
    MatSelectModule,
    MatInputModule,
    TranslateModule,
    TruncateModule,
    CheckedItemsModule,
    UnitSelectModule,
    MatCheckboxModule,
    BdSelectModule
  ],
  exports: [MultipleEditComponent]
})
export class MultipleEditModule {}
