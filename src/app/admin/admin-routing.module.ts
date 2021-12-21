import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('../platform/platform.module').then(m => m.PlatformModule),
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
