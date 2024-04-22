import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';

import { TranslateModule } from 'src/app/_shared/pipes/translate/translate.module';
import { ReassignDialogModule } from './reassign-dialog/reassign-dialog.module';
import { UnitSelectModule } from 'src/app/_shared/components/unit-select/unit-select.module';

import { GeneralComponent } from './general.component';

import { DeactivateGuard } from 'src/app/_shared/guards/deactivate.guard';

const routes: Routes = [
  {
    path: '',
    component: GeneralComponent,
    canDeactivate: [DeactivateGuard]
  }
];

@NgModule({
  declarations: [GeneralComponent],
	imports: [
		CommonModule,
		RouterModule.forChild(routes),
		FormsModule,
		MatFormFieldModule,
		MatInputModule,
		MatSelectModule,
		TranslateModule,
		ReassignDialogModule,
		UnitSelectModule,
		MatCheckboxModule
	],
  providers: [DeactivateGuard]
})
export class GeneralModule {}
