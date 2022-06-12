import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import { TranslateModule } from 'src/app/_shared/pipes/translate/translate.module';

import { DatePickerComponent } from './date-picker.component';
import { CalendarComponent } from './calendar/calendar.component';

@NgModule({
	declarations: [DatePickerComponent, CalendarComponent],
	exports: [DatePickerComponent],
  imports: [
    CommonModule,
    MatIconModule,
    TranslateModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ]
})
export class DatePickerModule {}
