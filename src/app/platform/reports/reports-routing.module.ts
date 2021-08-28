import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('src/app/platform/reports/reports/reports.module').then(m => m.ReportsModule)
  },
  {
    path: 'sets',
    loadChildren: () => import('src/app/platform/reports/sets/sets.module').then(m => m.SetsModule)
  }
]

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ]
})
export class ReportsRoutingModule {}
