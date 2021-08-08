import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';

import { TranslateModule } from 'src/app/_shared/pipes/translate/translate.module';
import { DataTableModule } from 'src/app/_shared/components/data-table/data-table.module';
import { FormModule } from './form/form.module';

import { GroupsComponent } from './groups.component';

import { GroupService } from 'src/app/_shared/services/http/group.service';
import { UserService } from 'src/app/_shared/services/http/user.service';

import { UserSelectResolve } from 'src/app/_shared/resolves/user-select.resolve';

import { TranslatePipe } from 'src/app/_shared/pipes/translate/translate.pipe';

const routes: Routes = [
  {
    path: '',
    component: GroupsComponent,
    resolve: {
      users: UserSelectResolve
    }
  }
];

@NgModule({
  declarations: [GroupsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatDialogModule,
    TranslateModule,
    DataTableModule,
    FormModule
  ],
  providers: [
    GroupService,
    UserService,
    UserSelectResolve,
    TranslatePipe
  ]
})
export class GroupsModule {}
