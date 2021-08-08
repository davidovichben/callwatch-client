import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
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
