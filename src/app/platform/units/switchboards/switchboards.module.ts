import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SwitchboardsComponent } from './switchboards.component';

const routes: Routes = [
  { path: '', component: SwitchboardsComponent }
];

@NgModule({
  declarations: [
    SwitchboardsComponent
  ],
  imports: [
    RouterModule.forChild(routes)
  ]
})
export class SwitchboardsModule {}
