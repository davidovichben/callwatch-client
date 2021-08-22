import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TranslateModule } from 'src/app/_shared/pipes/translate/translate.module';
import { DataTableModule } from 'src/app/_shared/components/data-table/data-table.module';

import { GroupsComponent } from './groups.component';

import { GroupService } from 'src/app/_shared/services/http/group.service';

import { TranslatePipe } from 'src/app/_shared/pipes/translate/translate.pipe';

const routes: Routes = [
  {
    path: '',
    component: GroupsComponent
  },
  { path: 'form', loadChildren: () => import('./form/form.module').then(m => m.FormModule) },
];

@NgModule({
  declarations: [GroupsComponent],
  imports: [
    RouterModule.forChild(routes),
    TranslateModule,
    DataTableModule
  ],
  providers: [GroupService, TranslatePipe]
})
export class GroupsModule {}
