import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';

import { TranslateModule } from 'src/app/_shared/pipes/translate/translate.module';
import { DualGroupsSelectModule } from 'src/app/_shared/components/dual-groups-select/dual-groups-select.module';
import { UnitSelectModule } from 'src/app/_shared/components/unit-select/unit-select.module';

import { FormComponent } from 'src/app/platform/settings/extensions/form/form.component';

import { ExtensionService } from 'src/app/_shared/services/http/extension.service';
import { SwitchboardService } from 'src/app/_shared/services/http/switchboard.service';
import { SelectService } from 'src/app/_shared/services/http/select.service';

import { AcdFormSelectResolve } from 'src/app/_shared/resolves/acd-form-select.resolve';
import { ExtensionResolve } from 'src/app/_shared/resolves/extension.resolve';

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
      extension: ExtensionResolve,
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
    TranslateModule,
    UnitSelectModule,
    DualGroupsSelectModule
  ],
  providers: [
    ExtensionService,
    SwitchboardService,
    SelectService,
    ExtensionResolve,
    AcdFormSelectResolve,
    DeactivateGuard
  ]
})
export class FormModule {}
