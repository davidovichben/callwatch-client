import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';

import { TranslateModule } from 'src/app/_shared/pipes/translate/translate.module';

import { DateRangePickerComponent } from './date-range-picker.component';
import { CalendarComponent } from './calendar/calendar.component';
import { DateRangeInputComponent } from './date-range-input/date-range-input.component';

@NgModule({
  declarations: [DateRangePickerComponent, CalendarComponent, DateRangeInputComponent],
  exports: [DateRangePickerComponent, DateRangeInputComponent],
  imports: [
    CommonModule,
    TranslateModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule
  ]
})
export class DateRangePickerModule {}
