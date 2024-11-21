import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatFormField, MatLabel, MatOption, MatSelect } from '@angular/material/select';
import { FormsModule } from '@angular/forms';

import { TranslateModule } from 'src/app/_shared/pipes/translate/translate.module';
import { DatePickerModule } from 'src/app/_shared/components/date-picker/date-picker.module';

import { DashboardComponent } from './dashboard.component';

import { ReportsService } from '../../_shared/services/http/reports.service';

import { ReportsResolve } from '../../_shared/resolves/reports.resolve';
import { DonutChartComponent } from './donut-chart/donut-chart.component';
import { KpiChartComponent } from './kpi-chart/kpi-chart.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    resolve: { results: ReportsResolve }
  },
  // {
  //   path: 'form',
  //   loadChildren: () => import('./form/form.module').then(m => m.FormModule )
  // }
];

@NgModule({
  declarations: [DashboardComponent],
	imports: [
		CommonModule,
		RouterModule.forChild(routes),
		MatIconModule,
		TranslateModule,
		DatePickerModule,
		MatSelect,
		MatOption,
		MatLabel,
		MatFormField,
		FormsModule,
		DonutChartComponent,
		KpiChartComponent
	],
  providers: [ReportsResolve, ReportsService]
})
export class DashboardModule {}
