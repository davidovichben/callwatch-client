import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UsersComponent } from './users.component';
import { PermissionSelectResolve } from 'src/app/_shared/resolves/permission-select.resolve';
import { UnitsSelectResolve } from 'src/app/_shared/resolves/units-select.resolve';
import { LanguageSelectResolve } from '../../_shared/resolves/language-select.resolve';
import { DeactivateGuard } from '../../_shared/guards/deactivate.guard';
import { UserResolve } from '../../_shared/resolves/user.resolve';
import { PermissionService } from '../../_shared/services/http/permission.service';
import { UnitService } from '../../_shared/services/http/unit.service';
import { UserService } from '../../_shared/services/http/user.service';
import { SelectService } from '../../_shared/services/http/select.service';

const routes: Routes = [
  {
    path: '',
    component: UsersComponent,
    resolve: {
      permissions: PermissionSelectResolve,
      units: UnitsSelectResolve
    }
  },
  {
    path: 'form',
    loadChildren: () => import('./form/form.module').then(m => m.FormModule),
    resolve: {
      permissions: PermissionSelectResolve,
      units: UnitsSelectResolve,
      languages: LanguageSelectResolve
    },
    canDeactivate: [DeactivateGuard]
  },
  {
    path: 'form/:id',
    loadChildren: () => import('./form/form.module').then(m => m.FormModule),
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
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [
    PermissionService,
    PermissionSelectResolve,
    UnitService,
    UserService,
    SelectService,
    UnitsSelectResolve,
    UserResolve,
    LanguageSelectResolve,
    DeactivateGuard
  ]
})
export class UsersRoutingModule {}
