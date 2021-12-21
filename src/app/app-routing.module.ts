import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoggedInGuard } from 'src/app/_shared/guards/logged-in.guard';
import { GuestGuard } from 'src/app/_shared/guards/guest.guard';

const routes: Routes = [
  {
    path: 'platform',
    loadChildren: () => import('./platform/platform.module').then(m => m.PlatformModule),
    canLoad: [LoggedInGuard]
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin-routing.module').then(m => m.AdminRoutingModule),
    canLoad: [LoggedInGuard]
  },
  {
    path: '',
    loadChildren: () => import('./public/public.module').then(m => m.PublicModule),
    canLoad: [GuestGuard]
  }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
