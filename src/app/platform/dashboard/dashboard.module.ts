import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

import { TranslateModule } from 'src/app/_shared/pipes/translate/translate.module';
import { DatePickerModule } from 'src/app/_shared/components/date-picker/date-picker.module';

import { DashboardComponent } from './dashboard.component';

import { InsightsService } from '../../_shared/services/http/insights.service';

import { InsightsResolve } from '../../_shared/resolves/insights.resolve';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    resolve: { insights: InsightsResolve }
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
  providers: [InsightsResolve, InsightsService]
})
export class DashboardModule {}
