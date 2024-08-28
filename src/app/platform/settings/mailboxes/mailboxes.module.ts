import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DataTableModule } from 'src/app/_shared/components/data-table/data-table.module';
import { TranslateModule } from 'src/app/_shared/pipes/translate/translate.module';
import { MultipleEditModule } from 'src/app/platform/settings/mailboxes/multiple-edit/multiple-edit.module';

import { MailboxesComponent } from './mailboxes.component';

import { MailboxService } from 'src/app/_shared/services/http/mailbox.service';
import { SelectService } from 'src/app/_shared/services/http/select.service';

const routes: Routes = [
  {
    path: '',
    component: MailboxesComponent,
  },
  { path: 'form', loadChildren: () => import('src/app/platform/settings/mailboxes/form/form.module').then(m => m.FormModule) }
];

@NgModule({
  declarations: [MailboxesComponent],
  imports: [
    RouterModule.forChild(routes),
    DataTableModule,
    TranslateModule,
    MultipleEditModule
  ],
  providers: [MailboxService, SelectService]
})
export class MailboxesModule {}
