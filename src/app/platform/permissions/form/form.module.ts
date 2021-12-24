import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { TranslateModule } from 'src/app/_shared/pipes/translate/translate.module';

import { FormComponent } from './form.component';

import { PermissionService } from 'src/app/_shared/services/http/permission.service';
import { GenericService } from 'src/app/_shared/services/http/generic.service';

import { PermissionResolve } from 'src/app/_shared/resolves/permission.resolve';

const routes: Routes = [
  { path: '', component: FormComponent },
  {
    path: ':id',
    component: FormComponent,
    resolve: { permission: PermissionResolve }
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
    TranslateModule
  ],
  providers: [PermissionService, GenericService, PermissionResolve]
})
export class FormModule {}
