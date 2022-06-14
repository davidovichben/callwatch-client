import { Component, ElementRef, HostListener, Input, OnInit } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { SlideDown } from 'src/app/_shared/constants/animations';

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styles: [`:host { position: relative } mat-icon { cursor: pointer }`],
  animations: [SlideDown],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: DatePickerComponent, multi: true }
  ]
})
export class DatePickerComponent implements OnInit {

  @Input() placeholder: string;

  selected = {
    start: null,
    end: null
  }

  calendarOpened = false;

  private propagateChange = (_: any) => {};

  constructor(private elementRef: ElementRef) {}

  ngOnInit() {
    if (!this.placeholder) {
      this.placeholder = 'select_date';
    }
  }

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

    this.calendarOpened = this.elementRef.nativeElement.contains(e.target);
  }
}
