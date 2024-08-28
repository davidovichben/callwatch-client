import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'permissions',
    loadChildren: () => import('./permissions/permissions.module').then(m => m.PermissionsModule)
  },
  {
    path: 'mailServers',
    loadChildren: () => import('./mail-servers/mail-servers.module').then(m => m.MailServersModule)
  },
  {
    path: 'mailboxes',
    loadChildren: () => import('./mailboxes/mailboxes.module').then(m => m.MailboxesModule)
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule {}
