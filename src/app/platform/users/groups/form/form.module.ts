import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { TranslateModule } from 'src/app/_shared/pipes/translate/translate.module';
import { SelectGroupsModule } from 'src/app/_shared/components/select-groups/select-groups.module';

import { FormComponent } from './form.component';

import { UserService } from 'src/app/_shared/services/http/user.service';
import { PermissionService } from 'src/app/_shared/services/http/permission.service';
import { UnitService } from 'src/app/_shared/services/http/unit.service';
import { GroupService } from 'src/app/_shared/services/http/group.service';

import { PermissionSelectResolve } from 'src/app/_shared/resolves/permission-select.resolve';
import { UnitsResolve } from 'src/app/_shared/resolves/units.resolve';
import { UserSelectResolve } from 'src/app/_shared/resolves/user-select.resolve';
import { GroupResolve } from 'src/app/_shared/resolves/group.resolve';

const routes: Routes = [
  {
    path: '',
    component: FormComponent,
    resolve: {
      permissions: PermissionSelectResolve,
      units: UnitsResolve,
      users: UserSelectResolve
    }
  },
  {
    path: ':id',
    component: FormComponent,
    resolve: {
      group: GroupResolve,
      permissions: PermissionSelectResolve,
      units: UnitsResolve,
      users: UserSelectResolve
    }
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
    MatCheckboxModule,
    TranslateModule,
    SelectGroupsModule
  ],
  providers: [
    GroupService,
    UserService,
    PermissionService,
    UnitService,
    UserSelectResolve,
    PermissionSelectResolve,
    UnitsResolve,
    GroupResolve
  ]
})
export class FormModule {}
