import { Component, ViewChild, ElementRef, Input } from '@angular/core';

@Component({
  selector: 'app-time-input',
  templateUrl: './time-input.component.html',
  styleUrls: ['./time-input.component.styl']
})
export class TimeInputComponent {

  @ViewChild('hourInput') hourInput: ElementRef;
  @ViewChild('minuteInput') minuteInput: ElementRef;

  @Input() placeholder: string;

  hourTyped = 0;
  minuteTyped = 0;

  inputKeyUp(type: string): void {
    const input = type === 'hours' ? this.hourInput : this.minuteInput;
    const counter = type === 'hours' ? 'hourTyped' : 'minuteTyped';
    const maxValue = type === 'hours' ? 23 : 59;

    let value = +input.nativeElement.value;

    if (this[counter] > 2) {
      input.nativeElement.value = input.nativeElement.value.substr(0, 2);
      this[counter] = 2;
      return;
    }

    if (this[counter] < 2) {
      this[counter]++;
    }

    if (this[counter] === 2) {
      if (value > maxValue) {
        value = 23;
      }

      if (value < 0) {
        console.log('r')
        value = 0;
      }

      input.nativeElement.value = value < 10 ? '0' + value.toString() : value.toString();
      this[counter] = 0;

      if (type === 'hours') {
        this.minuteInput.nativeElement.select();
      } else {
        input.nativeElement.blur();
      }
    }
  }

  inputChanged(type: string): void {
    const input = type === 'hours' ? this.hourInput : this.minuteInput;
    const counter = type === 'hours' ? 'hourTyped' : 'minuteTyped';

    if (this[counter] === 1) {
      const value = +input.nativeElement.value;
      input.nativeElement.value = '0' + value.toString();
    }
  }
}

