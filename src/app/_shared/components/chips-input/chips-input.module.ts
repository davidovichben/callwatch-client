import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

import { TranslateModule } from 'src/app/_shared/pipes/translate/translate.module';

import { ChipsInputComponent } from './chips-input.component';

@NgModule({
	declarations: [ChipsInputComponent],
	exports: [ChipsInputComponent],
	imports: [
		CommonModule,
    MatIconModule,
    TranslateModule
	]
})
export class ChipsInputModule {}
