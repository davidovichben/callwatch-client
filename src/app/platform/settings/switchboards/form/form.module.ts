import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';

import { TranslateModule } from 'src/app/_shared/pipes/translate/translate.module';

import { FormComponent } from 'src/app/platform/settings/switchboards/form/form.component';

import { SwitchboardService } from 'src/app/_shared/services/http/switchboard.service';
import { SelectService } from 'src/app/_shared/services/http/select.service';

import { SwitchboardResolve } from 'src/app/_shared/resolves/switchboard.resolve';
import { SwitchboardTypeSelectResolve } from 'src/app/_shared/resolves/switchboard-type-select.resolve';
import { ManagerSelectResolve } from 'src/app/_shared/resolves/manager-select.resolve';
import { SwitchboardDefaultsResolve } from 'src/app/_shared/resolves/switchboard-defaults.resolve';

import { DeactivateGuard } from 'src/app/_shared/guards/deactivate.guard';

const routes: Routes = [
	{
		path: '',
		component: FormComponent,
    resolve: {
      types: SwitchboardTypeSelectResolve,
      managers: ManagerSelectResolve,
      defaults: SwitchboardDefaultsResolve
    },
    canDeactivate: [DeactivateGuard]
	},
	{
		path: ':id',
		component: FormComponent,
		resolve: {
			switchboard: SwitchboardResolve,
      types: SwitchboardTypeSelectResolve,
      managers: ManagerSelectResolve
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
    MatTooltipModule,
    TranslateModule
  ],
	providers: [
    SwitchboardService,
    SelectService,
    SwitchboardResolve,
    SwitchboardTypeSelectResolve,
    ManagerSelectResolve,
    SwitchboardDefaultsResolve,
    DeactivateGuard
  ]
})
export class FormModule {}
