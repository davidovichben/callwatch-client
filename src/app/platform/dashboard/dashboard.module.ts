import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { NgChartsModule } from 'ng2-charts';

import { TranslateModule } from 'src/app/_shared/pipes/translate/translate.module';

import { DashboardComponent } from './dashboard.component';

import { ReportWidgetService } from 'src/app/_shared/services/http/report-widget.service';

import { ReportWidgetsResolve } from 'src/app/_shared/resolves/report-widgets.resolve';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    // resolve: { widgets: ReportWidgetsResolve }
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
    NgChartsModule,
    TranslateModule
  ],
  providers: [ReportWidgetService, ReportWidgetsResolve]
})
export class DashboardModule {}
