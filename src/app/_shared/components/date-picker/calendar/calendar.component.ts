import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Moment } from 'moment';
import * as moment from 'moment/moment';

import { WeekDays } from 'src/app/_shared/constants/general';

type CalendarMonth = { object: Moment, days: string[] };

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.styl']
})
export class CalendarComponent implements OnInit {

  @Input() isRange: boolean;
  @Input() selected = { start: null, end: null }

  @Output() dateSelected = new EventEmitter;

  readonly weekDays = WeekDays;

  readonly quickSelectionLabels = ['today', 'yesterday'];

  months: CalendarMonth[] = [];

  ngOnInit(): void {
    if (this.selected.start) {
      this.setMonths(this.selected.start, true);
    } else {
      this.setMonths();
    }
  }

  slideMonths(action: 'next' | 'previous'): void {
    const obj = moment(this.months[0].object);
    action === 'next' ? obj.add(1, 'M') : obj.subtract(1, 'M');

    setTimeout(() => this.setMonths(obj, true), 0);
  }

  selectDay(month: CalendarMonth, dayIndex: number): void {
    this.resetMonthDays();

    month.days[dayIndex] = 'selected';

    this.selected.start = moment(month.object).set('date', dayIndex + 1);

    this.dateSelected.emit(this.selected.start);
  }

  selectRange(month: CalendarMonth, dayIndex: number): void {
    const selected = moment(month.object).set('date', dayIndex + 1);

    if (selected.isBefore(this.selected.start)) {
      this.selected.end = moment(this.selected.start);
      this.selected.start = selected;
    } else {
      this.selected.end = selected;
    }

    this.resetMonthDays();

    this.selectDaysInRange();
  }

  quickSelect(label: string): void {
    const obj = moment();

    switch (label) {
      case 'yesterday':
        obj.subtract(1, 'days');
        break;
    }

    this.setMonths(obj);

    this.selectDay(this.months[0], obj.date());
  }

  closeCalendar(save: boolean): void {
    if (!save) {
      this.setMonths();
      this.selected = { start: null, end: null };
    }

    this.dateSelected.emit(this.selected.start);
  }

  setMonths(monthObj = moment(), selectDate?: boolean): void {
    this.months[0] = { object: monthObj, days: [] };
    this.months[1] = { object: moment(monthObj).add(1, 'M'), days: [] };

    this.months.forEach(month => {
      month.days = new Array(month.object.daysInMonth()).fill('');

      if (selectDate && this.selected.start) {
        if (this.isRange && this.selected.end) {
          this.selectDaysInRange();
        } else {
          const selected = this.selected.start;
          if (selected.month() === month.object.month() && selected.year() === month.object.year()) {
            month.days[selected.date() - 1] = 'selected';
          }
        }
      }
    });
  }

  private resetMonthDays(): void {
    this.months.forEach(month => month.days.fill(''));
  }

  private selectDaysInRange(): void {
    const start = this.selected.start;
    const end = this.selected.end;

    this.months.some((month, monthIndex) => {
      return month.days.some((day, index) => {
        const date = month.object.set('date', index + 1);

        if (date.isBetween(start, end)) {
          month.days[index] = 'in-range';
        }

        if (date.isSame(start) || date.isSame(end)) {
          month.days[index] = 'selected';
        }

        return date.isSame(end);
      });
    });
  }
}
