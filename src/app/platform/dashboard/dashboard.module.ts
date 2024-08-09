import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

import { TranslateModule } from 'src/app/_shared/pipes/translate/translate.module';
import { DatePickerModule } from 'src/app/_shared/components/date-picker/date-picker.module';

import { DashboardComponent } from './dashboard.component';

import { StatsService } from '../../_shared/services/http/stats.service';

import { StatsResolve } from '../../_shared/resolves/stats.resolve';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    // resolve: { stats: StatsResolve }
  },
  {
    path: 'form',
    loadChildren: () => import('./form/form.module').then(m => m.FormModule )
  }
];

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatIconModule,
    TranslateModule,
    DatePickerModule
  ],
  providers: [StatsResolve, StatsService]
})
export class DashboardModule {}
