import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TranslateModule } from './pipes/translate/translate.module';
import { TruncateModule } from './pipes/truncate/truncate.module';
import { ArrayToStringModule } from './pipes/array-to-string/array-to-string.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    TruncateModule,
    ArrayToStringModule
  ],
  exports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    TruncateModule,
    ArrayToStringModule
  ]
})
export class SharedModule {}
