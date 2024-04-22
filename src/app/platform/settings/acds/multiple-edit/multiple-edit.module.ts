import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';

import { TranslateModule } from 'src/app/_shared/pipes/translate/translate.module';
import { CheckedItemsModule } from 'src/app/_shared/components/multiple-edit/checked-items/checked-items.module';

import { MultipleEditComponent } from './multiple-edit.component';

@NgModule({
  declarations: [MultipleEditComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatSelectModule,
    MatInputModule,
    MatCheckboxModule,
    TranslateModule,
    CheckedItemsModule,
  ],
  exports: [MultipleEditComponent]
})
export class MultipleEditModule {}
