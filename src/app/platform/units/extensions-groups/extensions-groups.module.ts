import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

import { TranslateModule } from 'src/app/_shared/pipes/translate/translate.module';
import { SelectGroupsModule } from 'src/app/_shared/components/select-groups/select-groups.module';
import { BdSelectModule } from 'src/app/_shared/components/bd-select/bd-select.module';

import { ExtensionsGroupsComponent } from './extensions-groups.component';

import { ExtensionGroupService } from 'src/app/_shared/services/http/extension-group.service';
import { SelectService } from 'src/app/_shared/services/http/select.service';

import { ExtensionGroupFormSelectResolve } from 'src/app/_shared/resolves/extension-group-form-select.resolve';
import { ExtensionGroupResolve } from 'src/app/_shared/resolves/extension-group.resolve';

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
    SelectGroupsModule
  ],
  providers: [
    ExtensionGroupService,
    SelectService,
    ExtensionGroupResolve,
    ExtensionGroupFormSelectResolve
  ]
})
export class ExtensionsGroupsModule {}
