import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HistoricalComponent } from './historical.component';

const routes: Routes = [
  { path: '', component: HistoricalComponent }
];

@NgModule({
  declarations: [HistoricalComponent],
  imports: [
    RouterModule.forChild(routes)
  ]
})
export class HistoricalModule {}
