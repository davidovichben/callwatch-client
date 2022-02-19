import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { TranslateModule } from 'src/app/_shared/pipes/translate/translate.module';
import { DualGroupsSelectModule } from 'src/app/_shared/components/dual-groups-select/dual-groups-select.module';

import { FormComponent } from './form.component';
import { AddComputedColumnComponent } from './add-computed-column/add-computed-column.component';
import { ColumnSettingsComponent } from './column-settings/column-settings.component';

import { ReportService } from 'src/app/_shared/services/http/report.service';

import { ReportResolve } from 'src/app/_shared/resolves/report.resolve';

import { DeactivateGuard } from 'src/app/_shared/guards/deactivate.guard';

const routes: Routes = [
  {
    path: '',
    component: FormComponent,
    canDeactivate: [DeactivateGuard]
  },
  {
    path: ':id',
    component: FormComponent,
    resolve: { report: ReportResolve },
    canDeactivate: [DeactivateGuard]
  }
];

@NgModule({
  declarations: [FormComponent, AddComputedColumnComponent, ColumnSettingsComponent],
	imports: [
		CommonModule,
		RouterModule.forChild(routes),
		ReactiveFormsModule,
		MatFormFieldModule,
		MatInputModule,
		MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
		MatIconModule,
		MatDialogModule,
		TranslateModule,
		DualGroupsSelectModule,
	],
  providers: [ReportService, ReportResolve, DeactivateGuard]
})
export class FormModule {}
