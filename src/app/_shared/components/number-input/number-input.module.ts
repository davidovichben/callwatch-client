import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
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
