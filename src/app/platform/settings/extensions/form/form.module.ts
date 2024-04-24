import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';

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
