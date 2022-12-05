import { Component, EventEmitter, Output } from '@angular/core';
import { Moment } from 'moment';
import * as moment from 'moment/moment';

import { WeekDays } from 'src/app/_shared/constants/general';

type CalendarMonth = { object: Moment, days: boolean[], previousDays: number[] };

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.styl']
})
export class CalendarComponent {

  @Output() dateSelected = new EventEmitter();

  readonly weekDays = WeekDays;

  readonly quickSelectionLabels = ['today', 'yesterday'];

  selected = null;

  months: CalendarMonth[] = [];

  public writeValue(value?: Moment): void {
    this.selected = value;

    if (this.selected) {
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

    month.days[dayIndex] = true;

    this.selected = moment(month.object).set('date', dayIndex + 1);
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

  closeCalendar(save: boolean): void {
    if (!save) {
      this.setMonths();
      this.selected = null;
    }

    this.dateSelected.emit(this.selected);
  }

  setMonths(monthObj = moment(), selectDate?: boolean): void {
    this.months[0] = { object: moment(monthObj.startOf('month')), days: [], previousDays: [] };
    this.months[1] = { object: moment(monthObj.add(1, 'months').endOf('month')), days: [], previousDays: [] };

    this.months.forEach(month => {
      month.days = new Array(month.object.daysInMonth()).fill(false);

      const startOfMonth = moment(month.object).startOf('month');
      let startWeekDay = startOfMonth.weekday();
      for (let i = 0; i < startWeekDay; startWeekDay--) {
        const previousDay = startOfMonth.subtract(1, 'days').date();
        month.previousDays.unshift(previousDay);
      }

      if (selectDate && this.selected) {
        if (this.selected.month() === month.object.month() && this.selected.year() === month.object.year()) {
          month.days[this.selected.date() - 1] = true;
        }
      }
    });
  }

  private resetMonthDays(): void {
    this.months.forEach(month => month.days.fill(false));
  }
}
