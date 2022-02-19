import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'templates'
  },
  {
    path: 'templates',
    loadChildren: () => import('./templates/templates.module').then(m => m.TemplatesModule)
  },
  {
    path: 'sets',
    loadChildren: () => import('./sets/sets.module').then(m => m.SetsModule)
  },
  {
    path: 'timings',
    loadChildren: () => import('./timings/timings.module').then(m => m.TimingsModule)
  },
  {
    path: 'historical',
    loadChildren: () => import('./historical/historical.module').then(m => m.HistoricalModule)
  },
  {
    path: '**',
    redirectTo: ''
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule {}
