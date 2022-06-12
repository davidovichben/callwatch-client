import { Component, ElementRef, HostListener } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { SlideDown } from 'src/app/_shared/constants/animations';

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.styl'],
  animations: [SlideDown],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: DatePickerComponent, multi: true }
  ]
})
export class DatePickerComponent {

  selected = {
    start: null
  }

  calendarOpened = false;

  private propagateChange = (_: any) => {};

  constructor(private elementRef: ElementRef) {}

  dateSelected(momentObj: any): void {
    if (!momentObj) {
      this.selected.start = null;
      this.propagateChange(null);
    } else {
      this.selected.start = momentObj.format('DD/MM/YYYY');
      this.propagateChange(momentObj.format('YYYY-MM-DD'));
    }
  }

  writeValue(value: any): void {

  }

  registerOnChange(fn: any) {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {

  }

  setDisabledState(isDisabled: boolean): void {

  }

  @HostListener('document:click', ['$event'])
  documentClicked(e: PointerEvent): void {
    if (!this.calendarOpened) {
      return;
    }

    let clickedComponent: any = e.target;
    let inside = false;

    do {
      if (clickedComponent === this.elementRef.nativeElement) {
        inside = true;
      }

      clickedComponent = clickedComponent.parentNode;
    } while (clickedComponent) {
      if (!inside) {
        this.calendarOpened = false;
      }
    }
  }
}
