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

  monthObjects = [];
  daysInMonths = [];

  selected = {
    start: null,
    end: null
  }

  ngOnInit(): void {
    this.setMonthObjects(moment());
  }

  slideMonths(action: 'add' | 'subtract'): void {
    const obj = this.monthObjects[0][action](1, 'M');
    this.setMonthObjects(obj);
  }

  setMonthObjects(monthObj: Moment): void {
    this.monthObjects[0] = monthObj;
    this.monthObjects[1] = moment(monthObj).add(1, 'M');

    this.monthObjects.forEach((obj, index) => {
      this.daysInMonths[index] = new Array(obj.daysInMonth());
    });

    if (this.selected.start) {
      const selected = this.selected.start;

      const monthObjectIndex = this.monthObjects.findIndex(monthObj => {
        return selected.obj.year() === monthObj.year() && selected.obj.month() === monthObj.month();
      });

      if (monthObjectIndex !== -1) {
        this.daysInMonths[monthObjectIndex][selected.day] = true;
      }
    }
  }

  selectDate(dayIndex: number, monthIndex: number): void {
    const monthObj = this.monthObjects[monthIndex];

    this.resetMonthDays();

    this.daysInMonths[monthIndex][dayIndex] = true;

    this.selected.start = { day: dayIndex, obj: monthObj };

    const output = moment((dayIndex + 1) + '-' + (monthObj.month() + 1) + '-' + monthObj.year(), 'DD-MM-YYYY');

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

    let monthObjectIndex = this.monthObjects.findIndex(monthObj => {
      return obj.year() === monthObj.year() && obj.month() === monthObj.month();
    });

    if (monthObjectIndex === -1) {
      this.setMonthObjects(obj);
      monthObjectIndex = 0;
    }

    this.selectDate(obj.date(), monthObjectIndex);
  }

  resetMonthDays(): void {
    this.daysInMonths.forEach(days => days.fill(false));
  }

  closeCalendar(save: boolean): void {
    if (!save) {
      this.dateSelected.emit(null);
    }

    this.close.emit(true);
  }
}
