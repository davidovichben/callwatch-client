import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { TranslateModule } from 'src/app/_shared/pipes/translate/translate.module';
import { FormModule } from './form/form.module';

import { GeneralComponent } from './general.component';

import { GroupService } from 'src/app/_shared/services/http/group.service';
import { UserService } from 'src/app/_shared/services/http/user.service';
import { UnitPermissionEntityService } from 'src/app/_shared/services/http/unit-permission-entity.service';

import { GroupSelectResolve } from 'src/app/_shared/resolves/group-select.resolve';
import { UserSelectResolve } from 'src/app/_shared/resolves/user-select.resolve';
import { UnitResolve } from 'src/app/_shared/resolves/unit.resolve';

const routes: Routes = [
  {
    path: '',
    component: GeneralComponent,
    resolve: {
      groups: GroupSelectResolve,
      users: UserSelectResolve,
      unit: UnitResolve
    }
  }
];

@NgModule({
  declarations: [GeneralComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    TranslateModule,
    FormModule
  ],
  providers: [
    UserService,
    GroupService,
    UnitPermissionEntityService,
    UnitResolve,
    GroupSelectResolve,
    UserSelectResolve
  ]
})
export class GeneralModule {}
