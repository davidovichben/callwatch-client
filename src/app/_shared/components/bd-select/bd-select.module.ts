import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

import { BdSelectComponent } from './bd-select.component';
import { BdOptionComponent } from './bd-option/bd-option.component';

import { TranslatePipe } from 'src/app/_shared/pipes/translate/translate.pipe';

@NgModule({
	imports: [CommonModule, FormsModule, MatIconModule],
	exports: [BdSelectComponent, BdOptionComponent],
	declarations: [BdSelectComponent, BdOptionComponent],
  providers: [TranslatePipe]
})
export class BdSelectModule {}
