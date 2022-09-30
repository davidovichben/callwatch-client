import { AbstractControl } from '@angular/forms';

export function israeliIDValidator(control: AbstractControl): any {

	if (!control.value) {
		return null;
	}

	let IDnum = String(control.value);

	if ((IDnum.length > 9) || (IDnum.length < 5)) {
		return { id: true };
	}

	if (IDnum.length < 9) {
		while (IDnum.length < 9) {
			IDnum = '0' + IDnum;
		}
	}

	let counter = 0, incNum;
	for (let i = 0; i < 9; i++) {
		incNum = Number(IDnum.charAt(i));
		incNum *= (i % 2) + 1;
		if (incNum > 9) {
			incNum -= 9;
		}
		counter += incNum;
	}

	return (counter % 10 !== 0) ? { id: true } : null;
}
