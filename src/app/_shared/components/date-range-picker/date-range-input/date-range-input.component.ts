import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import * as moment from 'moment/moment';

@Component({
  selector: 'app-date-range-input',
  templateUrl: './date-range-input.component.html',
  styles: [`.mat-error { margin: 30px 0 0 0; font-size: 12px }`],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: DateRangeInputComponent, multi: true }
  ]
})
export class DateRangeInputComponent implements ControlValueAccessor {

  @Input() placeholder: string;
  @Input() disabled = false;

  @Output() dateChange = new EventEmitter();

  value = null;

  hasInvalidDateError = false;
  hasDateRangeError = false;

  public propagateChange = (_: any) => {};

  dateChanged(date: string): void {
    this.hasInvalidDateError = false;
    if (date) {
      const momentObj = moment(date, 'DD/MM/YYYY');
      if (!momentObj.isValid()) {
        this.hasInvalidDateError = true;
        return;
      }

      this.propagateChange(momentObj.format('YYYY-MM-DD'));
      this.dateChange.emit(momentObj)
    } else {
      this.propagateChange(null);
      this.dateChange.emit(null)
    }
  }

  public clearErrors(): void {
    this.hasDateRangeError = false;
    this.hasInvalidDateError = false;
  }

  writeValue(value: string): void {
    if (value) {
      this.value = moment(value, 'YYYY-MM-DD');
    }
  }

  reset(): void {
    this.clearErrors();
    this.value = null;
  }

  registerOnChange(fn: any) {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {

  }

  setDisabledState(isDisabled: boolean): void {

  }
}
