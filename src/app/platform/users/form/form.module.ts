import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';

import { TranslateModule } from 'src/app/_shared/pipes/translate/translate.module';
import { FileInputModule } from 'src/app/_shared/components/file-input/file-input.module';
import { UnitSelectModule } from 'src/app/_shared/components/unit-select/unit-select.module';
import { SetPasswordModule } from 'src/app/_shared/components/set-password/set-password.module';

import { FormComponent } from 'src/app/platform/users/form/form.component';
import { PasswordComponent } from 'src/app/platform/users/form/password/password.component';

import { UserService } from 'src/app/_shared/services/http/user.service';
import { PermissionService } from 'src/app/_shared/services/http/permission.service';
import { UnitService } from 'src/app/_shared/services/http/unit.service';

import { PermissionSelectResolve } from 'src/app/_shared/resolves/permission-select.resolve';
import { UnitsResolve } from 'src/app/_shared/resolves/units.resolve';
import { UserResolve } from 'src/app/_shared/resolves/user.resolve';

const routes: Routes = [
  {
    path: '',
    component: FormComponent,
    resolve: {
      permissions: PermissionSelectResolve,
      units: UnitsResolve
    }
  },
  {
    path: ':id',
    component: FormComponent,
    resolve: {
      user: UserResolve,
      permissions: PermissionSelectResolve,
      units: UnitsResolve
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
		TranslateModule,
		FileInputModule,
    UnitSelectModule,
    SetPasswordModule
	],
  providers: [
    UserService,
    PermissionService,
    UnitService,
    PermissionSelectResolve,
    UnitsResolve,
    UserResolve
  ]
})
export class FormModule {}
