import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatIconModule } from '@angular/material/icon';

import { TranslateModule } from 'src/app/_shared/pipes/translate/translate.module';

import { SetPasswordComponent } from './set-password.component';

@NgModule({
  declarations: [SetPasswordComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    TranslateModule
  ],
  exports: [SetPasswordComponent]
})
export class SetPasswordModule {}
