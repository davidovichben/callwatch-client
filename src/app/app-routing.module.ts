import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import loggedInGuard from 'src/app/_shared/guards/logged-in.guard';
import guestGuard from 'src/app/_shared/guards/guest.guard';
import { UnreadNotificationsResolver } from './_shared/resolvers/unread-notifications.resolver';

const routes: Routes = [
  {
    path: 'platform',
    loadComponent: () => import('./platform/platform.component').then(m => m.PlatformComponent),
    canMatch: [loggedInGuard],
    resolve: {
      unreadNotificationsCount: UnreadNotificationsResolver
    },
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard'
      },
      {
        path: 'dashboard',
        loadChildren: () => import('./platform/dashboard/dashboard.module').then(m => m.DashboardModule)
      },
      {
        path: 'units',
        loadChildren: () => import('./platform/units/units.module').then(m => m.UnitsModule),
        data: { 'noPadding': true }
      },
      {
        path: 'reports',
        loadChildren: () => import('./platform/reports/reports-routing.module').then(m => m.ReportsRoutingModule)
      },
      {
        path: 'users',
        loadChildren: () => import('./platform/users/users-routing.module').then(m => m.UsersRoutingModule),
      },
      {
        path: 'settings',
        loadChildren: () => import('./platform/settings/settings-routing.module').then(m => m.SettingsRoutingModule)
      },
      {
        path: 'auditTrail',
        loadComponent: () => import('./platform/audit-trail/audit-trail.component').then(m => m.AuditTrailComponent)
      },
      {
        path: 'notifications',
        loadComponent: () => import('./platform/notifications/notifications.component').then(m => m.NotificationsComponent)
      },
      {
        path: '**',
        redirectTo: '/platform'
      }
    ]
    
  },
  {
    path: 'admin',
    loadComponent: () => import('./admin/admin.component').then(m => m.AdminComponent),
    canMatch: [loggedInGuard]
  },
  {
    path: '',
    loadComponent: () => import('./public/public.component').then(m => m.PublicComponent),
    canMatch: [guestGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () => import('./public/login/login.component').then(m => m.LoginComponent)
      },
      {
        path: 'forgot',
        loadComponent: () => import('./public/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent)
      }
    ]
  }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  // imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
