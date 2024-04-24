import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
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
