import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

import { TranslateModule } from 'src/app/_shared/pipes/translate/translate.module';
import { DatePickerModule } from 'src/app/_shared/components/date-picker/date-picker.module';

import { DashboardComponent } from './dashboard.component';

import { ReportsService } from '../../_shared/services/http/reports.service';

import { ReportsResolve } from '../../_shared/resolves/reports.resolve';
import { MatFormField, MatLabel, MatOption, MatSelect } from '@angular/material/select';

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
		MatFormField
	],
  providers: [ReportsResolve, ReportsService]
})
export class DashboardModule {}
