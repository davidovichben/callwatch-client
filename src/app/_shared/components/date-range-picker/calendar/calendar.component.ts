import { Component, EventEmitter, Output } from '@angular/core';
import { Moment } from 'moment';
import * as moment from 'moment/moment';

import { WeekDays } from 'src/app/_shared/constants/general';

type CalendarMonth = { object: Moment, days: number[], previousDays: number[] };

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
export class CalendarComponent {

  @Output() dateSelected = new EventEmitter;

  readonly weekDays = WeekDays;
  readonly dayStates = DayStates;

  readonly quickSelectionLabels = ['today', 'yesterday', 'current_week', 'last_week', 'current_month', 'last_month'];

  public selected = { start: null, end: null }

  months: CalendarMonth[] = [];

  public writeValue(value: { start?: Moment, end?: Moment }): void {
    this.selected.start = value.start;
    this.selected.end = value.end;

    if (!this.selected.start && this.selected.end) {
      this.selected.start = value.end;
      this.selected.end = null;
    }

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

  dayClicked(month: CalendarMonth, dayIndex: number): void {
    const selectedObj = moment(month.object).set('date', dayIndex + 1);

    switch (true) {
      case !this.selected.start:
        this.selectDay(month, dayIndex);
        break;
      case this.selected.start.isSame(selectedObj):
        if (!this.selected.end) {
          this.resetMonthDays();
          this.selected.start = null;
        }
        break;
      default:
        this.selectRange(selectedObj);
    }
  }

  quickSelect(label: string): void {
    const obj = moment();
    if (label === 'yesterday') {
      obj.subtract(1, 'days');
    }

    // Setting new months if date isn't in displayed months

    let month = this.months[0].object.month() === obj.month() ? this.months[0] : this.months[1];
    if (!obj.isBetween(this.months[0].object, this.months[1].object)) {
      this.setMonths(obj);
      month = this.months[0];
    }

    this.selectDay(month, obj.date());
    this.closeCalendar(true);
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
        this.selected.start = moment().startOf('month').endOf('day');
        this.selected.end = moment().endOf('month');
        break;
      case 'last_month':
        this.selected.start = moment().subtract(1, 'month').startOf('month').endOf('day');
        this.selected.end = moment().subtract(1, 'month').endOf('month');
    }

    // Setting new months if date isn't in displayed months

    if (!this.selected.start.isBetween(this.months[0].object, this.months[1].object)) {
      this.setMonths(this.selected.start);
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

  private setMonths(monthObj = moment(), selectDate?: boolean): void {
    this.months[0] = {
      object: moment(monthObj).set('date', 1),
      days: [],
      previousDays: []
    };

    this.months[1] = {
      object: moment(monthObj).add(1, 'months').endOf('month'),
      days: [],
      previousDays: []
    };

    this.months.forEach(month => {
      month.days = new Array(month.object.daysInMonth()).fill(this.dayStates.NOT_SELECTED);

      // Filling previous month days to align the week days with this month's dates

      const startOfMonth = moment(month.object).startOf('month');
      let startWeekDay = startOfMonth.weekday();
      for (let i = 0; i < startWeekDay; startWeekDay--) {
        const previousDay = startOfMonth.subtract(1, 'days').date();
        month.previousDays.unshift(previousDay);
      }

      if (selectDate && this.selected.start) {
        if (this.selected.end) {
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

  private selectDay(month: CalendarMonth, dayIndex: number): void {
    this.resetMonthDays();

    month.days[dayIndex] = this.dayStates.SELECTED;

    this.selected.start = moment(month.object).set('date', dayIndex + 1);
    this.selected.end = null;
  }

  private selectRange(selectedObj: Moment): void {
    this.resetMonthDays();

    const start = this.selected.start;
    const end = this.selected.end;

    switch (true) {
      case selectedObj.isBetween(start, end) && selectedObj.diff(start, 'd') < selectedObj.diff(end, 'd') * -1:
        this.selected.start = selectedObj;
        break;
      case selectedObj.isBefore(start):
        if (!end) {
          this.selected.end = moment(start);
        }

        this.selected.start = selectedObj;
        break;
      default:
        this.selected.end = selectedObj;
    }

    this.selectDaysInRange();
  }

  private selectDaysInRange(): void {
    const start = this.selected.start.startOf('day');
    const end = this.selected.end.startOf('day');

    this.months.some(month => {
      return month.days.some((day, index) => {
        const date = moment(month.object).set('date', index + 1).startOf('day');

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
