import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

import { TranslateModule } from 'src/app/_shared/pipes/translate/translate.module';

import { LangSelectComponent } from './lang-select.component';

@NgModule({
  declarations: [LangSelectComponent],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    TranslateModule
  ],
  exports: [LangSelectComponent]
})
export class LangSelectModule {}
