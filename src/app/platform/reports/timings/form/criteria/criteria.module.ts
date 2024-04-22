import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { MatLegacyRadioModule as MatRadioModule } from '@angular/material/legacy-radio';
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
