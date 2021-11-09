import { NgModule } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { TimeInputComponent } from './time-input.component';

@NgModule({
	declarations: [TimeInputComponent],
	exports: [TimeInputComponent],
  imports: [MatFormFieldModule, MatInputModule]
})
export class TimeInputModule {}
