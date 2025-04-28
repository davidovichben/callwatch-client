import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'general'
  },
  {
    path: 'general',
    loadChildren: () => import('./general/general.module').then(m => m.GeneralModule)
  },
  {
    path: 'keywords',
    loadChildren: () => import('./keywords/keywords.module').then(m => m.KeywordsModule)
  },
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
