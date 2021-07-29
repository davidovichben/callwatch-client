import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { CampaignsComponent } from './campaigns.component';

const routes: Routes = [
  { path: '', component: CampaignsComponent }
];

@NgModule({
  declarations: [CampaignsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class CampaignsModule {}
