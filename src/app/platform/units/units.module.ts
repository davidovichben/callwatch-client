import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

import { TranslateModule } from 'src/app/_shared/pipes/translate/translate.module';
import { UnitFormModule } from 'src/app/platform/units/unit-form/unit-form.module';

import { UnitsComponent } from './units.component';
import { UnitTreeComponent } from './unit-tree/unit-tree.component';

import { UnitService } from 'src/app/_shared/services/http/unit.service';

import { UnitsResolve } from 'src/app/_shared/resolves/units.resolve';
import { UnitResolve } from 'src/app/_shared/resolves/unit.resolve';

import { TranslatePipe } from 'src/app/_shared/pipes/translate/translate.pipe';

const routes: Routes = [
  {
    path: ':id',
    component: UnitsComponent,
    resolve: {
      unit: UnitResolve,
      units: UnitsResolve
    },
    pathMatch: '',
    data: { noPadding: true },
    children: [
      { path: 'general', loadChildren: () => import('./general/general.module').then(m => m.GeneralModule) },
      { path: 'users', loadChildren: () => import('./users/users.module').then(m => m.UsersModule) },
      { path: 'switchboards', loadChildren: () => import('./switchboards/switchboards.module').then(m => m.SwitchboardsModule) },
      { path: '', redirectTo: 'general' }
    ]
  },
  {
    path: '',
    redirectTo: 'root'
  }
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
  providers: [
    UnitService,
    UnitResolve,
    UnitsResolve,
    TranslatePipe
  ]
})
export class UnitsModule {}
