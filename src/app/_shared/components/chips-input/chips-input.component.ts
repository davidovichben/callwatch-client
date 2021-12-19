import { Component, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-chips-input',
  templateUrl: './chips-input.component.html',
  styleUrls: ['../_shared/form-field.styl', '../_shared/chips.styl', './chips-input.component.styl', ],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: ChipsInputComponent, multi: true }
  ]
})
export class ChipsInputComponent implements ControlValueAccessor {

  @Input() placeholder: string;
  @Input() rules: { pattern?: string; length?: number } = {};

  regex: RegExp;

  values = new Set();

  ngOnInit(): void {
    if (this.rules.pattern) {
      this.regex = new RegExp(this.rules.pattern);
    }
  }

  keyPressed( input: HTMLInputElement, event: KeyboardEvent): void {
    if (event.key !== 'Enter') {
      if (this.regex && !this.regex.test(event.key)) {
        event.preventDefault();
      }

      if (this.rules.length && input.value.length > this.rules.length) {
        event.preventDefault();
      }
    }

    if (event.key === 'Enter' && input.value) {
      event.preventDefault();

      this.values.add(input.value);
      this.propagateChange(Array.from(this.values));

      input.value = '';
    }
  }

  removeValue(value: number, event: MouseEvent): void {
    event.preventDefault();

    this.values.delete(value);
    this.propagateChange(Array.from(this.values));
  }

  writeValue(values: any[]): void {
    if (values) {
      this.values = new Set(values);
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
