import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DataTableModule } from 'src/app/_shared/components/data-table/data-table.module';
import { TranslateModule } from 'src/app/_shared/pipes/translate/translate.module';
import { FormModule } from './form/form.module';

import { UsersComponent } from './users.component';

import { UserService } from 'src/app/_shared/services/http/user.service';

import { TranslatePipe } from 'src/app/_shared/pipes/translate/translate.pipe';

const routes: Routes = [
  { path: '', component: UsersComponent }
];

@NgModule({
  declarations: [UsersComponent],
  imports: [
    RouterModule.forChild(routes),
    TranslateModule,
    DataTableModule,
    FormModule
  ],
  providers: [UserService, TranslatePipe]
})
export class UsersModule {}
