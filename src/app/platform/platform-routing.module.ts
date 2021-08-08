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
        loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)
      },
      {
        path: 'units',
        loadChildren: () => import('./units/units.module').then(m => m.UnitsModule),
        data: { 'noPadding': true }
      },
      {
        path: 'campaigns',
        loadChildren: () => import('./campaigns/campaigns.module').then(m => m.CampaignsModule)
      },
      {
        path: 'reports',
        loadChildren: () => import('./reports/reports-routing.module').then(m => m.ReportsRoutingModule)
      },
      {
        path: 'users',
        loadChildren: () => import('src/app/platform/users/users-routing.module').then(m => m.UsersRoutingModule)
      },
      {
        path: 'permissions',
        loadChildren: () => import('./permissions/permissions.module').then(m => m.PermissionsModule)
      },
      {
        path: 'schedules',
        loadChildren: () => import('./schedules/schedules.module').then(m => m.SchedulesModule)
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
export class PlatformRoutingModule {}
