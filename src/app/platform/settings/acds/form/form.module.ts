import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { MatIconModule } from '@angular/material/icon';

import { TranslateModule } from 'src/app/_shared/pipes/translate/translate.module';
import { DualGroupsSelectModule } from 'src/app/_shared/components/dual-groups-select/dual-groups-select.module';
import { UnitSelectModule } from 'src/app/_shared/components/unit-select/unit-select.module';

import { FormComponent } from 'src/app/platform/settings/acds/form/form.component';

import { AcdService } from 'src/app/_shared/services/http/acd.service';
import { SwitchboardService } from 'src/app/_shared/services/http/switchboard.service';
import { SelectService } from 'src/app/_shared/services/http/select.service';

import { AcdResolve } from 'src/app/_shared/resolves/acd.resolve';
import { AcdFormSelectResolve } from 'src/app/_shared/resolves/acd-form-select.resolve';

import { DeactivateGuard } from 'src/app/_shared/guards/deactivate.guard';

const routes: Routes = [
	{
		path: '',
		component: FormComponent,
    resolve: {
      selects: AcdFormSelectResolve
    },
    canDeactivate: [DeactivateGuard]
  },
	{
		path: ':id',
		component: FormComponent,
		resolve: {
      acd: AcdResolve,
      selects: AcdFormSelectResolve
    },
    canDeactivate: [DeactivateGuard]
  }
];

@NgModule({
	declarations: [FormComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    TranslateModule,
    UnitSelectModule,
    DualGroupsSelectModule
  ],
	providers: [
    AcdService,
    SwitchboardService,
    SelectService,
    AcdResolve,
    AcdFormSelectResolve,
    DeactivateGuard
  ]
})
export class FormModule {}
