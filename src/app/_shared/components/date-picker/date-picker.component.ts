import { Component, OnInit } from '@angular/core';

import * as moment from 'moment/moment';

import { WeekDays } from 'src/app/_shared/constants/general';

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.styl']
})
export class DatePickerComponent implements OnInit {

  readonly weekDays = WeekDays;

  firstMonth = {
    year: null,
    month: null,
    monthName: null,
    days: null
  }

  secondMonth = {
    year: null,
    month: null,
    monthName: null,
    days: null
  }

  selected = {
    start: null,
    end: null
  }

  ngOnInit(): void {
    this.firstMonth.year = moment().year();
    this.firstMonth.month = moment().month();
    this.firstMonth.monthName = moment().format('MMMM');
    this.firstMonth.days = new Array(moment().daysInMonth());

    console.log(this.firstMonth)

    const nextMonthDate = moment().add(1, 'M');

    this.secondMonth.year = nextMonthDate.year();
    this.secondMonth.month = nextMonthDate.month();
    this.secondMonth.monthName = nextMonthDate.format('MMMM');
    this.secondMonth.days = new Array(nextMonthDate.daysInMonth());
  }

  selectDate(day: number, date): void {
    const momentDate = moment(day + '-' + (date.month + 1) + '-' + date.year, 'D-MM-YYYY');

    if (!this.selected.start) {
      this.selected.start = momentDate;
    } else {
      this.selected.end = momentDate;
    }
  }
}
