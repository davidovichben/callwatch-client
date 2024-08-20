import { AfterViewInit, Component, ElementRef, HostListener, Input, ViewChild } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { Moment } from 'moment';
import moment from 'moment/moment';

import { CalendarComponent } from './calendar/calendar.component';

import { SlideToggle } from 'src/app/_shared/constants/animations';

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.sass'],
  animations: [SlideToggle],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: DatePickerComponent, multi: true }
  ]
})
export class DatePickerComponent implements AfterViewInit {

  @ViewChild(CalendarComponent) calendar: CalendarComponent;

  @Input() placeholder = 'select_date';

  hasInvalidDateError = false;

  value: Moment = null;

  calendarOpened = false;

  private propagateChange = (_: any) => {};

  constructor(private elementRef: ElementRef) {}

  ngAfterViewInit(): void {
    this.calendar.writeValue(this.value);
  }

  dateChanged(date: string): void {
    this.hasInvalidDateError = false;
    let change = null;
    let momentObj = null;

    if (date) {
      momentObj = moment(date, 'DD/MM/YYYY');
      if (!momentObj.isValid()) {
        this.hasInvalidDateError = true;
        return;
      }

      change = momentObj.format('YYYY-MM-DD');
    }

    this.calendar.writeValue(momentObj);
    this.propagateChange(change);
  }

  dateSelected(selected: Moment): void {
    this.hasInvalidDateError = false;
    if (!selected) {
      this.value = null;
      this.propagateChange(null);
    } else {
      this.value = moment(selected);
      this.propagateChange(this.value.format('YYYY-MM-DD'));
    }

    this.calendarOpened = false;
  }

  writeValue(value: any): void {
    if (value) {
      this.value = moment(value);
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
