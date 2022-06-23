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
import * as moment from 'moment/moment';

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

  calendarOpened = false;

  constructor(private elementRef: ElementRef) {}

  ngAfterContentInit(): void {
    this.writeCalendarValue();

    this.sub.add(this.inputs.first.dateChange.subscribe(() => this.writeCalendarValue()));
    this.sub.add(this.inputs.last.dateChange.subscribe(() => this.writeCalendarValue()));
  }

  writeCalendarValue(): void {
    const start = moment(this.inputs.first.value);
    const end = moment(this.inputs.last.value);

    this.calendar.writeValue({ start, end });
  }

  dateSelected(selected: { start: Moment, end?: Moment }): void {
    const start = selected.start ? selected.start.format('YYYY-MM-DD') : null;
    const end = selected.end ? selected.end.format('YYYY-MM-DD') : null;

    if (start) {
      this.inputs.first.writeValue(start);
      this.inputs.first.propagateChange(start);
    }

    if (end) {
      this.inputs.last.writeValue(end);
      this.inputs.last.propagateChange(end);
    }

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
