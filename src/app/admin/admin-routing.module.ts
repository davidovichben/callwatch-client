import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PlatformComponent } from 'src/app/platform/platform.component';

const routes: Routes = [
  {
    path: '',
    component: PlatformComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadChildren: () => import('./organizations/organizations.module').then(m => m.OrganizationsModule)
      },
      {
        path: 'organizations',
        loadChildren: () => import('./organizations/organizations.module').then(m => m.OrganizationsModule)
      },
      {
        path: '**',
        redirectTo: ''
      }
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {}
