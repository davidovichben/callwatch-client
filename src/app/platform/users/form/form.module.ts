import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';

import { TranslateModule } from 'src/app/_shared/pipes/translate/translate.module';
import { BdSelectModule } from 'src/app/_shared/components/bd-select/bd-select.module';
import { UnitSelectModule } from 'src/app/_shared/components/unit-select/unit-select.module';
import { SetPasswordModule } from 'src/app/_shared/components/set-password/set-password.module';

import { FormComponent } from 'src/app/platform/users/form/form.component';
import { PasswordComponent } from 'src/app/platform/users/form/password/password.component';

import { UserService } from 'src/app/_shared/services/http/user.service';
import { SelectService } from 'src/app/_shared/services/http/select.service';
import { UnitService } from 'src/app/_shared/services/http/unit.service';

import { PermissionSelectResolve } from 'src/app/_shared/resolves/permission-select.resolve';
import { UnitsSelectResolve } from 'src/app/_shared/resolves/units-select.resolve';
import { UserResolve } from 'src/app/_shared/resolves/user.resolve';
import { LanguageSelectResolve } from 'src/app/_shared/resolves/language-select.resolve';

import { TranslatePipe } from 'src/app/_shared/pipes/translate/translate.pipe';

import { DeactivateGuard } from 'src/app/_shared/guards/deactivate.guard';

const routes: Routes = [
  {
    path: '',
    component: FormComponent,
    resolve: {
      permissions: PermissionSelectResolve,
      units: UnitsSelectResolve,
      languages: LanguageSelectResolve
    },
    canDeactivate: [DeactivateGuard]
  },
  {
    path: ':id',
    component: FormComponent,
    resolve: {
      user: UserResolve,
      permissions: PermissionSelectResolve,
      units: UnitsSelectResolve,
      languages: LanguageSelectResolve
    },
    canDeactivate: [DeactivateGuard]
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
    MatTooltipModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    TranslateModule,
    BdSelectModule,
    UnitSelectModule,
    SetPasswordModule
  ],
  providers: [
    UserService,
    SelectService,
    UnitService,
    PermissionSelectResolve,
    UnitsSelectResolve,
    UserResolve,
    LanguageSelectResolve,
    TranslatePipe,
    DeactivateGuard
  ]
})
export class FormModule {}
