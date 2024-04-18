import { UntypedFormControl } from '@angular/forms';

export const isInteger = (control: UntypedFormControl) => {
  if (!control.value || control.value && parseInt(control.value) === parseInt(control.value)) {
    return null;
  }

  return { integer: true };
}
