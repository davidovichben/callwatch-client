import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'permissions',
    loadChildren: () => import('./permissions/permissions.module').then(m => m.PermissionsModule)
  },
  {
    path: 'schedules',
    loadChildren: () => import('./schedules/schedules.module').then(m => m.SchedulesModule)
  },
  {
    path: 'uniqueDays',
    loadChildren: () => import('./unique-days/unique-days.module').then(m => m.UniqueDaysModule)
  },
  {
    path: 'switchboards',
    loadChildren: () => import('./switchboards/switchboards.module').then(m => m.SwitchboardsModule)
  },
  {
    path: 'callbacks',
    loadChildren: () => import('./callbacks/callbacks.module').then(m => m.CallbacksModule)
  },
  {
    path: 'routers',
    loadChildren: () => import('./routers/routers.module').then(m => m.RoutersModule)
  },
  {
    path: 'acds',
    loadChildren: () => import('./acds/acds.module').then(m => m.AcdsModule)
  },
  {
    path: 'extensions',
    loadChildren: () => import('./extensions/extensions.module').then(m => m.ExtensionsModule)
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule {}
