import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';

import { DataTableModule } from 'src/app/_shared/components/data-table/data-table.module';
import { TranslateModule } from 'src/app/_shared/pipes/translate/translate.module';
import { BdSelectModule } from 'src/app/_shared/components/bd-select/bd-select.module';
import { MultipleEditModule } from 'src/app/platform/users/multiple-edit/multiple-edit.module';

import { UsersComponent } from 'src/app/platform/users/users.component';

import { UserService } from 'src/app/_shared/services/http/user.service';
import { PermissionService } from 'src/app/_shared/services/http/permission.service';
import { SelectService } from 'src/app/_shared/services/http/select.service';
import { UnitService } from 'src/app/_shared/services/http/unit.service';

import { PermissionSelectResolve } from 'src/app/_shared/resolves/permission-select.resolve';
import { UnitsSelectResolve } from 'src/app/_shared/resolves/units-select.resolve';

import { TranslatePipe } from 'src/app/_shared/pipes/translate/translate.pipe';

const routes: Routes = [
  {
    path: '',
    component: UsersComponent,
    resolve: {
      permissions: PermissionSelectResolve,
      units: UnitsSelectResolve,
    }
  },
  { path: 'form', loadChildren: () => import('src/app/platform/users/form/form.module').then(m => m.FormModule) }
];

@NgModule({
  declarations: [UsersComponent],
  imports: [
    RouterModule.forChild(routes),
    TranslateModule,
    DataTableModule,
    BdSelectModule,
    MultipleEditModule,
    MatDialogModule
  ],
  providers: [
    UserService,
    SelectService,
    PermissionService,
    PermissionSelectResolve,
    TranslatePipe,
    UnitsSelectResolve,
    UnitService
  ]
})
export class UsersModule {}
