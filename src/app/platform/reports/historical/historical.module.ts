import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { TranslateModule } from 'src/app/_shared/pipes/translate/translate.module';

import { HistoricalComponent } from './historical.component';

import { ReportTemplateService } from 'src/app/_shared/services/http/report-template.service';
import { SelectService } from 'src/app/_shared/services/http/select.service';
import { HistoricalReportsService } from 'src/app/_shared/services/state/historical-reports.service';

import { ReportModulesSelectResolve } from 'src/app/_shared/resolves/report-modules-select.resolve';

const routes: Routes = [
  {
    path: '',
    component: HistoricalComponent,
    children: [
      { path: '', redirectTo: 'criteria' },
      { path: 'criteria', loadChildren: () => import('./criteria/criteria.module').then(m => m.CriteriaModule) },
      { path: 'results', loadChildren: () => import('./results/results.module').then(m => m.ResultsModule) }
    ],
    resolve: {
      modules: ReportModulesSelectResolve
    }
  }
];

@NgModule({
  declarations: [HistoricalComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TranslateModule,
  ],
  providers: [
    HistoricalReportsService,
    ReportTemplateService,
    SelectService,
    ReportModulesSelectResolve,
  ]
})
export class HistoricalModule {}
