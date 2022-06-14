import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Moment } from 'moment';
import * as moment from 'moment/moment';

import { WeekDays } from 'src/app/_shared/constants/general';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.styl']
})
export class CalendarComponent implements OnInit {

  @Output() dateSelected = new EventEmitter;
  @Output() close = new EventEmitter;

  readonly weekDays = WeekDays;

  readonly quickSelectionLabels = ['today', 'yesterday'];

  months: { object: Moment, days: boolean[] }[] = [];

  selected = {
    start: null,
    end: null
  }

  ngOnInit(): void {
    this.setMonthObjects(moment());
  }

  slideMonths(action: 'next' | 'previous'): void {
    const obj = moment(this.months[0].object);
    action === 'next' ? obj.add(1, 'M') : obj.subtract(1, 'M');

    this.setMonthObjects(obj);
  }

  setMonthObjects(monthObj: Moment): void {
    this.months[0].object = monthObj;
    this.months[0].object = moment(monthObj).add(1, 'M');

    this.months.forEach((month, index) => {
      month.days = new Array(month.object.daysInMonth()).fill(false);
    });

    if (this.selected.start) {
      const selected = this.selected.start;

      const monthIndex = this.months.findIndex(month => {
        return selected.obj.year() === month.object.year() && selected.obj.month() === month.object.month();
      });

      if (monthIndex !== -1) {
        this.months[monthIndex].days[selected.day] = true;
      }
    }
  }

  selectDate(dayIndex: number, monthIndex: number): void {
    const month = this.months[monthIndex];

    this.resetMonthDays();

    month.days[dayIndex] = true;

    this.selected.start = { object: month.object, day: dayIndex };

    const output = moment((dayIndex + 1) + '-' + (month.object.month() + 1) + '-' + month.object.year(), 'DD-MM-YYYY');

    this.dateSelected.emit(output);
  }

  quickSelect(label: string): void {
    let obj = moment();

    switch (label) {
      case 'yesterday':
        obj = moment().subtract(1, 'days');
        break;
    }

    this.resetMonthDays();

    let monthIndex = this.months.findIndex(month => {
      return obj.year() === month.object.year() && obj.month() === month.object.month();
    });

    if (monthIndex === -1) {
      this.setMonthObjects(obj);
      monthIndex = 0;
    }

    this.selectDate(obj.date(), monthIndex);
  }

  resetMonthDays(): void {
    this.months.forEach(month => month.days.fill(false));
  }

  closeCalendar(save: boolean): void {
    if (!save) {
      this.resetMonthDays();
      this.selected = { start: null, end: null };
      this.dateSelected.emit(null);
    }

    this.close.emit(true);
  }
}
