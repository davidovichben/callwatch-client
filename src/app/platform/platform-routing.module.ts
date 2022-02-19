import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PlatformComponent } from 'src/app/platform/platform.component';

import { UserService } from 'src/app/_shared/services/http/user.service';

import { UserPermissionsResolve } from 'src/app/_shared/resolves/user-permissions.resolve';

const routes: Routes = [
  {
    path: '',
    component: PlatformComponent,
    resolve: { permissions: UserPermissionsResolve },
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
        path: 'reports',
        loadChildren: () => import('./reports/reports-routing.module').then(m => m.ReportsRoutingModule)
      },
      {
        path: 'users',
        loadChildren: () => import('./users/users.module').then(m => m.UsersModule),
      },
      {
        path: 'settings',
        loadChildren: () => import('./settings/settings-routing.module').then(m => m.SettingsRoutingModule)
      },
      {
        path: 'auditTrail',
        loadChildren: () => import('./audit-trail/audit-trail.module').then(m => m.AuditTrailModule)
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
  exports: [RouterModule],
  providers: [UserService, UserPermissionsResolve]
})
export class PlatformRoutingModule {}
