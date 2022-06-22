import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import * as moment from 'moment/moment';

@Component({
  selector: 'app-date-range-input',
  templateUrl: './date-range-input.component.html',
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: DateRangeInputComponent, multi: true }
  ]
})
export class DateRangeInputComponent implements ControlValueAccessor {

  @Input() placeholder: string;
  @Output() dateChange = new EventEmitter();

  value = null;

  public propagateChange = (_: any) => {};

  dateChanged(date: string): void {
    if (date) {
      const dateObj = moment(date);

      this.propagateChange(dateObj.format('YYYY-MM-DD'));
      this.dateChange.emit(dateObj)
    }
  }

  writeValue(value: string): void {
    if (value) {
      this.value = moment(value, 'YYYY-MM-DD').format('DD/MM/YYYY');
    }
  }

  registerOnChange(fn: any) {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {

  }

  setDisabledState(isDisabled: boolean): void {

  }
}
