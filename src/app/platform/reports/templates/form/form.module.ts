import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import {MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { TranslateModule } from 'src/app/_shared/pipes/translate/translate.module';
import { DualGroupsSelectModule } from 'src/app/_shared/components/dual-groups-select/dual-groups-select.module';

import { FormComponent } from './form.component';
import { ColumnSettingsComponent } from './column-settings/column-settings.component';

import { ReportTemplateService } from 'src/app/_shared/services/http/report-template.service';
import { SelectService } from 'src/app/_shared/services/http/select.service';
import { UnitService } from 'src/app/_shared/services/http/unit.service';

import { ReportTemplateResolve } from 'src/app/_shared/resolves/report-template.resolve';
import { ReportModulesSelectResolve } from 'src/app/_shared/resolves/report-modules-select.resolve';
import { UnitLevelsResolve } from 'src/app/_shared/resolves/unit-levels.resolve';

import { DeactivateGuard } from 'src/app/_shared/guards/deactivate.guard';

import { TranslatePipe } from 'src/app/_shared/pipes/translate/translate.pipe';

const routes: Routes = [
  {
    path: '',
    component: FormComponent,
    resolve: {
      modules: ReportModulesSelectResolve,
      levels: UnitLevelsResolve
    },
    canDeactivate: [DeactivateGuard]
  },
  {
    path: ':id',
    component: FormComponent,
    resolve: {
      modules: ReportModulesSelectResolve,
      levels: UnitLevelsResolve,
      reportTemplate: ReportTemplateResolve
    },
    canDeactivate: [DeactivateGuard]
  }
];

@NgModule({
  declarations: [FormComponent, ColumnSettingsComponent],
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
		DualGroupsSelectModule
	],
  providers: [
    ReportTemplateService,
    SelectService,
    UnitService,
    ReportTemplateResolve,
    ReportModulesSelectResolve,
    UnitLevelsResolve,
    DeactivateGuard,
    TranslatePipe
  ]
})
export class FormModule {}
