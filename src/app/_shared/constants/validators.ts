import * as moment from 'moment';
import { FormControl } from '@angular/forms';

export const isDateGreaterOrEqual = (minControlName: FormControl, control: FormControl) => {
  const minValue = moment(minControlName.value).utc();
  const maxValue = moment(control.value).utc();
  const greater = maxValue.diff(minValue, 'days') >= 0;

  return !greater ? { range: true } : null;
}
