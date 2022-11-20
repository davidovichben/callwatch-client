import {
  AfterContentInit,
  Component,
  ContentChildren,
  ElementRef,
  HostListener,
  OnDestroy, QueryList,
  ViewChild
} from '@angular/core';
import { Moment } from 'moment';

import { CalendarComponent } from './calendar/calendar.component';
import { DateRangeInputComponent } from './date-range-input/date-range-input.component';

import { SlideToggle } from 'src/app/_shared/constants/animations';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-date-range-picker',
  templateUrl: './date-range-picker.component.html',
  styleUrls: ['./date-range-picker.component.styl'],
  animations: [SlideToggle]
})
export class DateRangePickerComponent implements AfterContentInit, OnDestroy {

  @ViewChild(CalendarComponent, { static: true }) calendar: CalendarComponent;
  @ContentChildren(DateRangeInputComponent) inputs: QueryList<DateRangeInputComponent>;

  readonly sub = new Subscription();

  selected = {
    start: null,
    end: null
  }

  calendarOpened = false;

  constructor(private elementRef: ElementRef) {}

  ngAfterContentInit(): void {
    const first = this.inputs.first;
    const last = this.inputs.last;

    this.selected.start = first.value;
    this.selected.end = last.value;

    this.writeCalendarValue();

    this.sub.add(first.dateChange.subscribe(value => this.writeCalendarValue(value, 'start')));
    this.sub.add(last.dateChange.subscribe(value => this.writeCalendarValue(value, 'end')));
  }

  writeCalendarValue(value?: Moment, type?: string): void {
    if (type) {
      this.selected[type] = value;

      const inputType = type === 'start' ? this.inputs.first : this.inputs.last;

      inputType.hasDateRangeError = this.selected.start && this.selected.start.isAfter(this.selected.end);
      if (inputType.hasDateRangeError) {
        this.selected[type] = null;
      }
    }

    this.calendar.writeValue(this.selected);
  }

  dateSelected(selected: { start: Moment, end?: Moment }): void {
    if (selected.start && !selected.end) {
      selected.end = selected.start;
    }

    ['start', 'end'].forEach(valueType => {
      const value = selected[valueType] ? selected[valueType].format('YYYY-MM-DD') : null;
      if (value) {
        const input = valueType === 'start' ? this.inputs.first : this.inputs.last;
        input.writeValue(value);
        input.propagateChange(value);
        input.clearErrors();
      }
    });

    this.calendarOpened = false;
  }

  @HostListener('document:click', ['$event'])
  documentClicked(e: PointerEvent): void {
    if (!this.calendarOpened) {
      return;
    }

    this.calendarOpened = this.elementRef.nativeElement.contains(e.target);
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
