import { Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { Moment } from 'moment';
import * as moment from 'moment/moment';

import { CalendarComponent } from './calendar/calendar.component';

import { SlideToggle } from 'src/app/_shared/constants/animations';

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styles: [`:host { position: relative } mat-icon { cursor: pointer }`],
  animations: [SlideToggle],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: DatePickerComponent, multi: true }
  ]
})
export class DatePickerComponent implements OnInit {

  @ViewChild(CalendarComponent) calendar: CalendarComponent;

  @Input() placeholder: string;

  selected = {
    start: null,
    end: null
  }

  calendarOpened = false;

  private propagateChange = (_: any) => {};

  constructor(private elementRef: ElementRef) {}

  ngOnInit() {
    if (!this.placeholder) {
      this.placeholder = 'select_date';
    }
  }

  dateSelected(momentObj: Moment): void {
    if (!momentObj) {
      this.selected.start = null;
      this.propagateChange(null);
      this.calendarOpened = false;
    } else {
      this.selected.start = momentObj;
      this.propagateChange(momentObj.format('YYYY-MM-DD'));
    }
  }

  writeValue(value: any): void {
    if (value) {
      this.selected.start = moment(value, 'YYYY-MM-DD');
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
    if (!this.calendarOpened) {
      this.calendar.setMonths();
    }
  }
}
