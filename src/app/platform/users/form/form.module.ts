import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';

import { TranslateModule } from 'src/app/_shared/pipes/translate/translate.module';
import { BdSelectModule } from 'src/app/_shared/components/bd-select/bd-select.module';
import { UnitSelectModule } from 'src/app/_shared/components/unit-select/unit-select.module';
import { SetPasswordModule } from 'src/app/_shared/components/set-password/set-password.module';

import { FormComponent } from 'src/app/platform/users/form/form.component';
import { PasswordComponent } from 'src/app/platform/users/form/password/password.component';

import { UserService } from 'src/app/_shared/services/http/user.service';
import { PermissionService } from 'src/app/_shared/services/http/permission.service';
import { UnitService } from 'src/app/_shared/services/http/unit.service';

import { PermissionSelectResolve } from 'src/app/_shared/resolves/permission-select.resolve';
import { UnitsSelectResolve } from 'src/app/_shared/resolves/units-select.resolve';
import { UserResolve } from 'src/app/_shared/resolves/user.resolve';

import { TranslatePipe } from 'src/app/_shared/pipes/translate/translate.pipe';

const routes: Routes = [
  {
    path: '',
    component: FormComponent,
    resolve: {
      permissions: PermissionSelectResolve,
      units: UnitsSelectResolve
    }
  },
  {
    path: ':id',
    component: FormComponent,
    resolve: {
      user: UserResolve,
      permissions: PermissionSelectResolve,
      units: UnitsSelectResolve
    }
  }
];

@NgModule({
  declarations: [FormComponent, PasswordComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatDialogModule,
    MatIconModule,
    TranslateModule,
    BdSelectModule,
    UnitSelectModule,
    SetPasswordModule
  ],
  providers: [
    UserService,
    PermissionService,
    UnitService,
    PermissionSelectResolve,
    UnitsSelectResolve,
    UserResolve,
    TranslatePipe
  ]
})
export class FormModule {}
