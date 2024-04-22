import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';

import { TranslateModule } from 'src/app/_shared/pipes/translate/translate.module';
import { UnitSelectModule } from 'src/app/_shared/components/unit-select/unit-select.module';

import { UnitFormComponent } from './unit-form.component';

@NgModule({
  declarations: [UnitFormComponent],
	imports: [
		CommonModule,
		FormsModule,
		MatDialogModule,
		MatFormFieldModule,
		MatSelectModule,
		MatInputModule,
		TranslateModule,
		UnitSelectModule,
		MatCheckboxModule
	],
  exports: [UnitFormComponent]
})
export class UnitFormModule {}
