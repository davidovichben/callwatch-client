import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatDividerModule } from '@angular/material/divider';

import { TranslateModule } from 'src/app/_shared/pipes/translate/translate.module';

import { DatePickerComponent } from './date-picker.component';
import { CalendarComponent } from './calendar/calendar.component';

@NgModule({
	declarations: [DatePickerComponent, CalendarComponent],
	exports: [DatePickerComponent],
  imports: [
    CommonModule,
    TranslateModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule
  ]
})
export class DatePickerModule {}
