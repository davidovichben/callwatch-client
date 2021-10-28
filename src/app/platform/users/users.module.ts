import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

import { DataTableModule } from 'src/app/_shared/components/data-table/data-table.module';
import { TranslateModule } from 'src/app/_shared/pipes/translate/translate.module';

import { UsersComponent } from 'src/app/platform/users/users.component';

import { UserService } from 'src/app/_shared/services/http/user.service';

import { TranslatePipe } from 'src/app/_shared/pipes/translate/translate.pipe';

const routes: Routes = [
  { path: '', component: UsersComponent },
  { path: 'form', loadChildren: () => import('./form/form.module').then(m => m.FormModule) }
];

@NgModule({
  declarations: [UsersComponent],
  imports: [
    RouterModule.forChild(routes),
    MatIconModule,
    TranslateModule,
    DataTableModule
  ],
  providers: [UserService, TranslatePipe]
})
export class UsersModule {}
