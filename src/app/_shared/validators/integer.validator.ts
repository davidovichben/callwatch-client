import { FormControl } from '@angular/forms';

export const isInteger = (control: FormControl) => {
  if (!control.value || control.value && parseInt(control.value) === parseInt(control.value)) {
    return null;
  }

  return { integer: true };
}
