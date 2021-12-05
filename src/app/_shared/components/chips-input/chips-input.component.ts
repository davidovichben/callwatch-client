import { Component, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-chips-input',
  templateUrl: './chips-input.component.html',
  styleUrls: ['./chips-input.component.styl'],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: ChipsInputComponent, multi: true }
  ]
})
export class ChipsInputComponent implements ControlValueAccessor {

  @Input() placeholder: string;
  @Input() pattern: string;
  @Input() length: number;

  regex: RegExp;

  values = [];

  ngOnInit(): void {
    if (this.pattern) {
      this.regex = new RegExp(this.pattern);
    }
  }

  addValue(event: KeyboardEvent, input: HTMLInputElement): void {
    if (event.key !== 'Enter') {
      if (this.regex && !this.regex.test(event.key)) {
        event.preventDefault();
      }

      if (this.length && input.value.length > this.length) {
        event.preventDefault();
      }
    }

    if (event.key === 'Enter' && input.value) {
      this.values.push(input.value);
      this.propagateChange(this.values);

      input.value = '';
    }
  }

  removeValue(index: number): void {
    this.values.splice(index, 1);
    this.propagateChange(this.values);
  }

  writeValue(values: any[]): void {
    if (values) {
      this.values = values;
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
