import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { TranslateModule } from 'src/app/_shared/pipes/translate/translate.module';

import { GeneralComponent } from './general.component';

import { PermissionService } from 'src/app/_shared/services/http/permission.service';
import { UserService } from 'src/app/_shared/services/http/user.service';
import { UnitUserService } from 'src/app/_shared/services/http/unit-user.service';

import { UserSelectResolve } from 'src/app/_shared/resolves/user-select.resolve';
import { PermissionResolve } from 'src/app/_shared/resolves/permission.resolve';

const routes: Routes = [
  {
    path: '',
    component: GeneralComponent,
    resolve: { users: UserSelectResolve, permissions: PermissionResolve }
  }
];

@NgModule({
  declarations: [GeneralComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    TranslateModule
  ],
  providers: [
    PermissionService,
    UserService,
    UnitUserService,
    UserSelectResolve,
    PermissionResolve
  ]
})
export class GeneralModule {}
