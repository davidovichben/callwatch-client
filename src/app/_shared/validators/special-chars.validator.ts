import { AbstractControl } from '@angular/forms';

export function specialCharsValidator(control: AbstractControl): any {

	const regExp = RegExp('^[\\s]+|[\\\\*\\/&!^%$@#()\\.+=\\[\\]{}]+', 'i');

	const isInValid = !control.value ? null : regExp.test(control.value);

	return isInValid ? { specialChars: true } : null;
}
