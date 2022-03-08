import { Component, ElementRef, Input, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-pin-input',
  templateUrl: './pin-input.component.html',
  styleUrls: ['./pin-input.component.styl'],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: PinInputComponent, multi: true }
  ]
})
export class PinInputComponent implements OnInit, ControlValueAccessor {

  @ViewChildren('inputEle') elements: QueryList<ElementRef>;

  @Input() length: number;

  numbers: any[];

  private propagateChange = (_: any) => {};

  ngOnInit() {
    this.numbers = new Array(this.length).fill('');
  }

  numberEntered(index: number, key: string): void {
    const elements = this.elements.toArray();

    if (key === 'Backspace' && index > 0) {
      const prevElement = elements[index - 1].nativeElement;
      prevElement.value = '';
      prevElement.focus();
      return;
    }

    const element = elements[index].nativeElement;

    if (isNaN(+key)) {
      this.numbers[index] = '';
      return;
    }

    if (element.value >= 10) {
      element.value = '00000';
    }

    element.value = +key;

    let result = '';
    this.elements.forEach(iteratedElement => result += iteratedElement.nativeElement.value);

    if (result.length === this.length) {
      this.propagateChange(result);
    } else {
      if (elements[index + 1]) {
        elements[index + 1].nativeElement.focus();
      }
    }
  }

  reset(): void {
    this.elements.forEach(iteratedElement => iteratedElement.nativeElement.value = '');
  }

  writeValue(value: string): void {
  }

  registerOnChange(fn: any) {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {

  }

  setDisabledState(isDisabled: boolean): void {

  }
}
