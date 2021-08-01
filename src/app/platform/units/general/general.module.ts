import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { TranslateModule } from 'src/app/_shared/pipes/translate/translate.module';
import { FormModule } from './form/form.module';

import { GeneralComponent } from './general.component';

import { PermissionService } from 'src/app/_shared/services/http/permission.service';
import { UserService } from 'src/app/_shared/services/http/user.service';
import { UnitUserService } from 'src/app/_shared/services/http/unit-user.service';

import { UserSelectResolve } from 'src/app/_shared/resolves/user-select.resolve';
import { PermissionSelectResolve } from 'src/app/_shared/resolves/permission-select.resolve';

const routes: Routes = [
  {
    path: '',
    component: GeneralComponent,
    resolve: { users: UserSelectResolve, permissions: PermissionSelectResolve }
  }
];

@NgModule({
  declarations: [GeneralComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    TranslateModule,
    FormModule
  ],
  providers: [
    PermissionService,
    UserService,
    UnitUserService,
    UserSelectResolve,
    PermissionSelectResolve
  ]
})
export class GeneralModule {}
