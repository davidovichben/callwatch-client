import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslateModule } from 'src/app/_shared/pipes/translate/translate.module';

import { DatePickerComponent } from './date-picker.component';

@NgModule({
	declarations: [DatePickerComponent],
	exports: [DatePickerComponent],
	imports: [CommonModule, TranslateModule]
})
export class DatePickerModule {}
