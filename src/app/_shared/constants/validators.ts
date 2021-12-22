import * as moment from 'moment';
import Diff = moment.unitOfTime.Diff;
import { FormControl } from '@angular/forms';

export const isDateGreaterOrEqual = (args: { minControl: FormControl, unitOfTime?: Diff }, control: FormControl) => {
  if (!args.unitOfTime) {
    args.unitOfTime = 'days';
  }

  if (!args.minControl.value || !control.value) {
    return null;
  }

  const minValue = moment(args.minControl.value).utc();
  const maxValue = moment(control.value).utc();
  const greater = maxValue.diff(minValue, args.unitOfTime) >= 0;
  
  return !greater ? { range: true } : null;
}
