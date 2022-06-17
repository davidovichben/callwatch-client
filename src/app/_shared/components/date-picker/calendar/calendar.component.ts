import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Moment } from 'moment';
import * as moment from 'moment/moment';

import { WeekDays } from 'src/app/_shared/constants/general';

type CalendarMonth = { object: Moment, days: number[] };

export enum DayStates {
  NOT_SELECTED = 0,
  BETWEEN = 1,
  SELECTED = 2,
  START = 3,
  END = 4
}

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
  readonly dayStates = DayStates;

  readonly quickSelectionLabels = {
    base: ['today', 'yesterday'],
    range: ['current_week', 'last_week', 'current_month', 'last_month']
  };

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

    month.days[dayIndex] = this.dayStates.SELECTED;

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
    if (label === 'yesterday') {
      obj.subtract(1, 'days');
    }

    this.selectDay(this.months[0], obj.date());
  }

  quickSelectRange(label: string): void {
    this.resetMonthDays();

    switch (label) {
      case 'current_week':
        this.selected.start = moment().startOf('week');
        this.selected.end = moment().endOf('week');
        break;
      case 'last_week':
        this.selected.start = moment().subtract(1, 'week').startOf('week');
        this.selected.end = moment().subtract(1, 'week').endOf('week');
        break;
      case 'current_month':
        this.selected.start = moment().startOf('month');
        this.selected.end = moment().endOf('month');
        break;
      case 'last_month':
        this.selected.start = moment().subtract(1, 'month').startOf('month');
        this.selected.end = moment().subtract(1, 'month').endOf('month');
    }

    this.selectDaysInRange();
  }

  closeCalendar(save: boolean): void {
    if (!save) {
      this.setMonths();
      this.selected = { start: null, end: null };
    }

    this.dateSelected.emit(this.selected);
  }

  setMonths(monthObj = moment(), selectDate?: boolean): void {
    this.months[0] = { object: monthObj, days: [] };
    this.months[1] = { object: moment(monthObj).add(1, 'M'), days: [] };

    this.months.forEach(month => {
      month.days = new Array(month.object.daysInMonth()).fill(this.dayStates.NOT_SELECTED);

      if (selectDate && this.selected.start) {
        if (this.isRange && this.selected.end) {
          this.selectDaysInRange();
        } else {
          const selected = this.selected.start;
          if (selected.month() === month.object.month() && selected.year() === month.object.year()) {
            month.days[selected.date() - 1] = this.dayStates.SELECTED;
          }
        }
      }
    });
  }

  private resetMonthDays(): void {
    this.months.forEach(month => month.days.fill(this.dayStates.NOT_SELECTED));
  }

  private selectDaysInRange(): void {
    const start = this.selected.start.startOf('day')
    const end = this.selected.end.startOf('day');

    this.months.some((month, monthIndex) => {
      return month.days.some((day, index) => {
        const date = month.object.set('date', index + 1).startOf('day');

        let stateCode = 0;

        switch (true) {
          case date.isBetween(start, end):
            stateCode = this.dayStates.BETWEEN;
            break;
          case date.isSame(start):
            stateCode = this.dayStates.START;
            break;
          case date.isSame(end):
            stateCode = this.dayStates.END;
        }

        month.days[index] = stateCode;

        return date.isSame(end);
      });
    });
  }
}
