import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoggedInGuard } from 'src/app/_shared/guards/logged-in.guard';
import { GuestGuard } from 'src/app/_shared/guards/guest.guard';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadChildren: () => import('./public/login/login.module').then(m => m.LoginModule),
    canLoad: [GuestGuard]
  },
  {
    path: 'platform',
    loadChildren: () => import('./platform/platform.module').then(m => m.PlatformModule),
    canLoad: [LoggedInGuard]
  }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
