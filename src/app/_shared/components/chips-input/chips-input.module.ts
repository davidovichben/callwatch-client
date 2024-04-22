import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from 'src/app/_shared/pipes/translate/translate.module';

import { ChipsInputComponent } from './chips-input.component';

@NgModule({
  declarations: [
    ChipsInputComponent
  ],
  exports: [
    ChipsInputComponent
  ],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    TranslateModule
  ]
})
export class ChipsInputModule {}
