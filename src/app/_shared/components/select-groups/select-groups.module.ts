import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';

import { TranslateModule } from 'src/app/_shared/pipes/translate/translate.module';

import { SelectGroupsComponent } from './select-groups.component';

@NgModule({
	declarations: [SelectGroupsComponent],
	exports: [SelectGroupsComponent],
	imports: [
		CommonModule,
		MatFormFieldModule,
		MatInputModule,
		MatCheckboxModule,
		TranslateModule,
		MatIconModule
	]
})
export class SelectGroupsModule {}
