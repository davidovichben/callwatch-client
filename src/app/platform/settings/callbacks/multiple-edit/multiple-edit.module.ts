import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ReactiveFormsModule } from '@angular/forms';

import { TranslateModule } from 'src/app/_shared/pipes/translate/translate.module';
import { CheckedItemsModule } from 'src/app/_shared/components/multiple-edit/checked-items/checked-items.module';

import { MultipleEditComponent } from './multiple-edit.component';

@NgModule({
  declarations: [MultipleEditComponent],
  imports: [
    CommonModule,
    TranslateModule,
    ReactiveFormsModule,
    MatDialogModule,
    CheckedItemsModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule
  ],
  exports: [MultipleEditComponent]
})
export class MultipleEditModule {}
