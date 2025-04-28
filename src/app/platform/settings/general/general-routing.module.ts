import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { GeneralComponent } from './general.component';
import { OrganizationSettingsResolve } from 'src/app/_shared/resolves/organization-settings.resolve';

const routes: Routes = [
  {
    path: '',
    component: GeneralComponent,
    resolve: {
      settings: OrganizationSettingsResolve
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GeneralRoutingModule { }
