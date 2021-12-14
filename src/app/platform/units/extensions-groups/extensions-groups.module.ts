import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

import { TranslateModule } from 'src/app/_shared/pipes/translate/translate.module';
import { SelectGroupsModule } from 'src/app/_shared/components/select-groups/select-groups.module';
import { BdSelectModule } from 'src/app/_shared/components/bd-select/bd-select.module';

import { ExtensionsGroupsComponent } from './extensions-groups.component';

import { UnitService } from 'src/app/_shared/services/http/unit.service';
import { SelectService } from 'src/app/_shared/services/http/select.service';

import { GroupExtensionFormSelectResolve } from 'src/app/_shared/resolves/group-extension-form-select.resolve';
import { UnitGroupExtensionResolve } from 'src/app/_shared/resolves/unit-group-extension.resolve';

const routes: Routes = [
  {
    path: '',
    component: ExtensionsGroupsComponent,
    resolve: {
      unit: UnitGroupExtensionResolve,
      selects: GroupExtensionFormSelectResolve
    }
  }
];

@NgModule({
  declarations: [ExtensionsGroupsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    MatButtonModule,
    BdSelectModule,
    TranslateModule,
    SelectGroupsModule
  ],
  providers: [
    UnitService,
    SelectService,
    UnitGroupExtensionResolve,
    GroupExtensionFormSelectResolve
  ]
})
export class ExtensionsGroupsModule {}
