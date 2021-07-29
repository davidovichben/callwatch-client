import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

import { BdSelectComponent } from './bd-select.component';
import { BdOptionComponent } from './bd-option/bd-option.component';

@NgModule({
	imports: [CommonModule, FormsModule, MatIconModule],
	exports: [BdSelectComponent, BdOptionComponent],
	declarations: [BdSelectComponent, BdOptionComponent]
})
export class BdSelectModule {}
