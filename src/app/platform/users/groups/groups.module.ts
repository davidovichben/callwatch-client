import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';

import { TranslateModule } from 'src/app/_shared/pipes/translate/translate.module';
import { DataTableModule } from 'src/app/_shared/components/data-table/data-table.module';
import { FormModule } from './form/form.module';

import { GroupsComponent } from './groups.component';

import { GroupService } from 'src/app/_shared/services/http/group.service';
import { UserService } from 'src/app/_shared/services/http/user.service';
import { PermissionService } from 'src/app/_shared/services/http/permission.service';
import { UnitService } from 'src/app/_shared/services/http/unit.service';

import { UserSelectResolve } from 'src/app/_shared/resolves/user-select.resolve';
import { UnitsResolve } from 'src/app/_shared/resolves/units.resolve';
import { PermissionSelectResolve } from 'src/app/_shared/resolves/permission-select.resolve';

import { TranslatePipe } from 'src/app/_shared/pipes/translate/translate.pipe';

const routes: Routes = [
  {
    path: '',
    component: GroupsComponent,
    resolve: {
      users: UserSelectResolve,
      permissions: PermissionSelectResolve,
      units: UnitsResolve
    }
  }
];

@NgModule({
  declarations: [GroupsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatDialogModule,
    TranslateModule,
    DataTableModule,
    FormModule
  ],
  providers: [
    GroupService,
    UserService,
    PermissionService,
    UnitService,
    UserSelectResolve,
    PermissionSelectResolve,
    UnitsResolve,
    TranslatePipe
  ]
})
export class GroupsModule {}
