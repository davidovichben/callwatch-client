import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import {MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';

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
