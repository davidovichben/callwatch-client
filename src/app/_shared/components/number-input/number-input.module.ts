import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatIconModule } from '@angular/material/icon';

import { TranslateModule } from 'src/app/_shared/pipes/translate/translate.module';

import { NumberInputComponent } from './number-input.component';

@NgModule({
	declarations: [NumberInputComponent],
	exports: [NumberInputComponent],
	imports: [
    CommonModule,
		MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    TranslateModule
	]
})
export class NumberInputModule {}
