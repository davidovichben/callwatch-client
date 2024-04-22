import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
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
