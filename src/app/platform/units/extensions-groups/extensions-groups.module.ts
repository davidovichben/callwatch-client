import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

import { TranslateModule } from 'src/app/_shared/pipes/translate/translate.module';
import { DualGroupsSelectModule } from 'src/app/_shared/components/dual-groups-select/dual-groups-select.module';
import { BdSelectModule } from 'src/app/_shared/components/bd-select/bd-select.module';

import { ExtensionsGroupsComponent } from './extensions-groups.component';

import { ExtensionGroupService } from 'src/app/_shared/services/http/extension-group.service';
import { SelectService } from 'src/app/_shared/services/http/select.service';

import { ExtensionGroupFormSelectResolve } from 'src/app/_shared/resolves/extension-group-form-select.resolve';
import { ExtensionGroupResolve } from 'src/app/_shared/resolves/extension-group.resolve';
import { SwitchboardService } from 'src/app/_shared/services/http/switchboard.service';

const routes: Routes = [
  {
    path: '',
    component: ExtensionsGroupsComponent,
    resolve: {
      extensionGroup: ExtensionGroupResolve,
      selects: ExtensionGroupFormSelectResolve
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
    DualGroupsSelectModule
  ],
  providers: [
    ExtensionGroupService,
    SelectService,
    SwitchboardService,
    ExtensionGroupResolve,
    ExtensionGroupFormSelectResolve
  ]
})
export class ExtensionsGroupsModule {}
