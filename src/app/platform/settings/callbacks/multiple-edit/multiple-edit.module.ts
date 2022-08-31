import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { TranslateModule } from 'src/app/_shared/pipes/translate/translate.module';
import { TruncateModule } from 'src/app/_shared/pipes/truncate/truncate.module';

import { MultipleEditComponent } from './multiple-edit.component';

@NgModule({
  declarations: [MultipleEditComponent],
  imports: [
    CommonModule,
    TranslateModule,
    TruncateModule,
    MatDialogModule,
    MatIconModule
  ],
  exports: [MultipleEditComponent]
})
export class MultipleEditModule {}
