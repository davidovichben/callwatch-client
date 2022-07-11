import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

import { TranslateModule } from 'src/app/_shared/pipes/translate/translate.module';
import { DatePickerModule } from 'src/app/_shared/components/date-picker/date-picker.module';

import { DashboardComponent } from './dashboard.component';

import { ReportWidgetService } from 'src/app/_shared/services/http/report-widget.service';

import { ReportWidgetsResolve } from 'src/app/_shared/resolves/report-widgets.resolve';
import { WidgetsAreaModule } from 'src/app/platform/dashboard/widgets-area/widgets-area.module';

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
    TranslateModule,
    DatePickerModule,
    WidgetsAreaModule
  ],
  providers: [ReportWidgetService, ReportWidgetsResolve]
})
export class DashboardModule {}
