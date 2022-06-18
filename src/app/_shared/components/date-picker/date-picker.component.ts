import { Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';
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
export class DatePickerComponent implements OnInit {

  @ViewChild(CalendarComponent) calendar: CalendarComponent;

  @Input() placeholder: string;
  @Input() isRange: boolean;

  selected = {
    start: null,
    end: null
  }

  value: string = null;

  calendarOpened = false;

  private propagateChange = (_: any) => {};

  constructor(private elementRef: ElementRef) {}

  ngOnInit() {
    if (!this.placeholder) {
      this.placeholder = this.isRange ? 'select_dates' : 'select_date';
    }
  }

  dateSelected(selected: { start: Moment, end?: Moment }): void {
    if (!selected.start) {
      this.selected.start = null;
      this.selected.end = null;
      this.propagateChange(this.isRange ? this.selected : null);
    } else {
      this.selected.start = selected.start;
      this.selected.end = selected.end;

      this.value = this.selected.start.format('DD/MM/YYYY');
      if (this.isRange && this.selected.end) {
        this.value += ' - ' + this.selected.end.format('DD/MM/YYYY');
      }

      let output = this.selected.start.format('YYYY-MM-DD');
      if (this.isRange) {
        output = { start: output, end: this.selected.end.format('YYYY-MM-DD') };
      }

      this.propagateChange(output);
    }

    this.calendarOpened = false;
  }

  writeValue(value: any): void {
    if (value) {
      this.selected.start = moment(value, 'YYYY-MM-DD');

      this.value = this.selected.start.format('DD/MM/YYYY');

      if (this.isRange) {
        this.selected.end = moment(value.end, 'YYYY-MM-DD');
        if (this.selected.end) {
          this.value += ' - ' + this.selected.end.format('DD/MM/YYYY');
        }
      }
    }
  }

  registerOnChange(fn: any) {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {

  }

  setDisabledState(isDisabled: boolean): void {

  }

  // @HostListener('document:click', ['$event'])
  // documentClicked(e: PointerEvent): void {
  //   if (!this.calendarOpened) {
  //     return;
  //   }
  //
  //   this.calendarOpened = this.elementRef.nativeElement.contains(e.target);
  // }
}
