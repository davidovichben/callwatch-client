import { Component, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ErrorMessages } from 'src/app/_shared/constants/error-messages';

@Component({
  selector: 'app-number-input',
  templateUrl: './number-input.component.html',
  styleUrls: ['../_shared/form-field.styl', './number-input.component.styl'],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: NumberInputComponent, multi: true }
  ]
})
export class NumberInputComponent implements ControlValueAccessor {

  readonly errorMessages = ErrorMessages;

  @Input() placeholder: string;
  @Input() required: boolean;

  value = 0;

  incrementValue(): void {
    this.value++;

    this.propagateChange(this.value);
  }

  decrementValue(): void {
    if (this.value > 0) {
      this.value--;
    }

    this.propagateChange(this.value);
  }

  writeValue(value: number): void {
    if (value) {
      this.value = +value;
    }
  }

  registerOnChange(fn: any) {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {

  }

  setDisabledState(isDisabled: boolean): void {

  }

  private propagateChange = (_: any) => {};
}
