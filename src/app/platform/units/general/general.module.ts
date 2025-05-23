import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';

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
