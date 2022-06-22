import { Component, ElementRef, HostListener, Input, ViewChild } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { Moment } from 'moment';
import * as moment from 'moment/moment';

import { CalendarComponent } from './calendar/calendar.component';

import { SlideToggle } from 'src/app/_shared/constants/animations';

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styles: [`:host { position: relative; width: 240px; } mat-icon { cursor: pointer }`],
  animations: [SlideToggle],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: DatePickerComponent, multi: true }
  ]
})
export class DatePickerComponent {

  @ViewChild(CalendarComponent) calendar: CalendarComponent;

  @Input() placeholder = 'select_date';

  selected: Moment = null;

  value: string = null;

  calendarOpened = false;

  private propagateChange = (_: any) => {};

  constructor(private elementRef: ElementRef) {}

  dateSelected(selected: Moment): void {
    if (!selected) {
      this.selected = null;
      this.propagateChange(null);
    } else {
      this.selected = selected;

      this.value = this.selected.format('DD/MM/YYYY');

      const output = this.selected.format('YYYY-MM-DD');
      this.propagateChange(output);
    }

    this.calendarOpened = false;
  }

  writeValue(value: any): void {
    if (value) {
      this.value = this.selected.format('DD/MM/YYYY');
      this.selected = moment(value, 'YYYY-MM-DD');
    }
  }

  registerOnChange(fn: any) {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {

  }

  setDisabledState(isDisabled: boolean): void {

  }

  @HostListener('document:click', ['$event'])
  documentClicked(e: PointerEvent): void {
    if (!this.calendarOpened) {
      return;
    }

    this.calendarOpened = this.elementRef.nativeElement.contains(e.target);
  }
}
