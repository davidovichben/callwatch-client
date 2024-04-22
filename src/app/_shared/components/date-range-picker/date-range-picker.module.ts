import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
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
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    TranslateModule
  ]
})
export class DateRangePickerModule {}
