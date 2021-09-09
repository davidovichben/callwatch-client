import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

import { TranslateModule } from 'src/app/_shared/pipes/translate/translate.module';

import { LocaleSelectComponent } from 'src/app/_shared/components/locale-select/locale-select.component';

@NgModule({
  declarations: [LocaleSelectComponent],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    TranslateModule
  ],
  exports: [LocaleSelectComponent]
})
export class LocaleSelectModule {}
