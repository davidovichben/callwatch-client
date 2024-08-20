import moment from 'moment';
import Diff = moment.unitOfTime.Diff;
import { UntypedFormControl } from '@angular/forms';

export const isDateGreaterOrEqual = (args: { minControl: UntypedFormControl, unitOfTime?: Diff }, control: UntypedFormControl) => {
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
