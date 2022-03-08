import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';

import { CriteriaComponent } from './criteria.component';

import { TranslateModule } from 'src/app/_shared/pipes/translate/translate.module';

@NgModule({
	declarations: [CriteriaComponent],
	exports: [CriteriaComponent],
	imports: [
		CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatRadioModule,
    MatDatepickerModule,
    MatIconModule,
    TranslateModule
	]
})
export class CriteriaModule {}
