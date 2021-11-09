import { Component, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-time-input',
  templateUrl: './time-input.component.html',
  styleUrls: ['./time-input.component.styl']
})
export class TimeInputComponent {
  @ViewChild('hourInput') hourInput: ElementRef;
  @ViewChild('minuteInput') minuteInput: ElementRef;

  hourTyped = 0;

  hourChanged(): void {
    let value = +this.hourInput.nativeElement.value;

    if (this.hourTyped < 2) {
      this.hourTyped++;
    }

    if (this.hourTyped === 1) {
      this.hourInput.nativeElement.value = '0' + value.toString();
    }

    if (this.hourTyped === 2) {
      if (value > 23) {
        value = 23;
      }

      if (value < 0) {
        value = 0;
      }

      this.hourInput.nativeElement.value = value < 10 ? '0' + value.toString() : value.toString();
      this.minuteInput.nativeElement.select();
    }
  }

  minuteChanged(): void {
    let value = +this.minuteInput.nativeElement.value;
    if (value > 59) {
      value = 59;
    }

    if (value < 0) {
      value = 0;
    }

    this.minuteInput.nativeElement.value = value < 10 ? '0' + value.toString() : value.toString();
  }
}

