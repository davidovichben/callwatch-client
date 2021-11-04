import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

import { DataTableModule } from 'src/app/_shared/components/data-table/data-table.module';
import { TranslateModule } from 'src/app/_shared/pipes/translate/translate.module';
import { BdSelectModule } from 'src/app/_shared/components/bd-select/bd-select.module';

import { UsersComponent } from 'src/app/platform/users/users.component';

import { UserService } from 'src/app/_shared/services/http/user.service';
import { PermissionService } from 'src/app/_shared/services/http/permission.service';

import { PermissionSelectResolve } from 'src/app/_shared/resolves/permission-select.resolve';

import { TranslatePipe } from 'src/app/_shared/pipes/translate/translate.pipe';

const routes: Routes = [
  {
    path: '',
    component: UsersComponent,
    resolve: { permissions: PermissionSelectResolve }
  },
  { path: 'form', loadChildren: () => import('./form/form.module').then(m => m.FormModule) }
];

@NgModule({
  declarations: [UsersComponent],
  imports: [
    RouterModule.forChild(routes),
    MatIconModule,
    MatMenuModule,
    TranslateModule,
    DataTableModule,
    BdSelectModule
  ],
  providers: [
    UserService,
    PermissionService,
    PermissionSelectResolve,
    TranslatePipe
  ]
})
export class UsersModule {}
