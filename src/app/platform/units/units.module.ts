import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

import { UnitsComponent } from './units.component';
import { UnitTreeComponent } from './unit-tree/unit-tree.component';
import { UnitFormModule } from './unit-form/unit-form.module';

import { TranslateModule } from 'src/app/_shared/pipes/translate/translate.module';
import { TranslatePipe } from 'src/app/_shared/pipes/translate/translate.pipe';

import { UnitService } from 'src/app/_shared/services/http/unit.service';
import { UnitResolve } from 'src/app/_shared/resolves/unit.resolve';
import { UnitsResolve } from 'src/app/_shared/resolves/units.resolve';

// Child routes for unit details
const childRoutes = [
  { path: '', loadChildren: () => import('./general/general.module').then(m => m.GeneralModule) },
  { path: 'general', loadChildren: () => import('./general/general.module').then(m => m.GeneralModule) },
  { path: 'users', loadComponent: () => import('./users/users.component').then(m => m.UsersComponent) },
];

// Common configuration for both routes
const commonRouteConfig = {
  component: UnitsComponent,
  resolve: {
    unit: UnitResolve,
    units: UnitsResolve
  }
};

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    ...commonRouteConfig
  },
  {
    path: ':id',
    pathMatch: 'full',
    data: { noPadding: true },
    children: childRoutes,
    ...commonRouteConfig
  },
];

@NgModule({
  declarations: [UnitsComponent, UnitTreeComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatIconModule,
    TranslateModule,
    UnitFormModule
  ],
  exports: [UnitTreeComponent],
  providers: [
    UnitService,
    UnitResolve,
    UnitsResolve,
    TranslatePipe
  ]
})
export class UnitsModule {}
