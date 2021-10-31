import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

import { TranslateModule } from 'src/app/_shared/pipes/translate/translate.module';
import { FormModule } from './form/form.module';

import { UsersComponent } from './users.component';

import { UnitUserService } from 'src/app/_shared/services/http/unit-user.service';

import { UnitUsersResolve } from 'src/app/_shared/resolves/unit-users.resolve';
import { UserSelectResolve } from 'src/app/_shared/resolves/user-select.resolve';

const routes: Routes = [
  {
    path: '',
    component: UsersComponent,
    resolve: {
      users: UserSelectResolve,
      unitUsers: UnitUsersResolve
    }
  }
];

@NgModule({
  declarations: [UsersComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatIconModule,
    TranslateModule,
    FormModule
  ],
  providers: [UnitUserService, UserSelectResolve, UnitUsersResolve]
})
export class UsersModule {}
