import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';

import { TranslateModule } from 'src/app/_shared/pipes/translate/translate.module';
import { ReassignDialogModule } from 'src/app/platform/settings/permissions/reassign-dialog/reassign-dialog.module';

import { FormComponent } from 'src/app/platform/settings/permissions/form/form.component';

import { PermissionService } from 'src/app/_shared/services/http/permission.service';
import { GenericService } from 'src/app/_shared/services/http/generic.service';
import { SelectService } from 'src/app/_shared/services/http/select.service';

import { PermissionResolve } from 'src/app/_shared/resolves/permission.resolve';

import { TranslatePipe } from 'src/app/_shared/pipes/translate/translate.pipe';

import { DeactivateGuard } from 'src/app/_shared/guards/deactivate.guard';

const routes: Routes = [
  {
    path: '',
    component: FormComponent,
    canDeactivate: [DeactivateGuard]
  },
  {
    path: ':id',
    component: FormComponent,
    resolve: { permission: PermissionResolve },
    canDeactivate: [DeactivateGuard]
  }
];

@NgModule({
  declarations: [FormComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatButtonModule,
    TranslateModule,
    ReassignDialogModule
  ],
  providers: [
    PermissionService,
    GenericService,
    SelectService,
    PermissionResolve,
    TranslatePipe,
    DeactivateGuard
  ]
})
export class FormModule {}
