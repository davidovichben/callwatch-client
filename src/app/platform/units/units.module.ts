import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { TranslateModule } from 'src/app/_shared/pipes/translate/translate.module';

import { UnitsComponent } from './units.component';
import { UnitContainerComponent } from './unit-container/unit-container.component';
import { UnitBlockComponent } from './unit-block/unit-block.component';

import { UnitService } from 'src/app/_shared/services/http/unit.service';

import { UnitsResolve } from 'src/app/_shared/resolves/units.resolve';

import { TranslatePipe } from 'src/app/_shared/pipes/translate/translate.pipe';

const routes: Routes = [
  {
    path: '',
    component: UnitsComponent,
    resolve: { units: UnitsResolve },
    children: [
      { path: '', loadChildren: () => import('./general/general.module').then(m => m.GeneralModule) }
    ]
  }
];

@NgModule({
  declarations: [
    UnitsComponent,
    UnitContainerComponent,
    UnitBlockComponent
  ],
	imports: [
		CommonModule,
		RouterModule.forChild(routes),
    TranslateModule
	],
  providers: [UnitService, UnitsResolve, TranslatePipe]
})
export class UnitsModule {}
