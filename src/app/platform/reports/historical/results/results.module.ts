import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { TranslateModule } from 'src/app/_shared/pipes/translate/translate.module';

import { ResultsComponent } from './results.component';
import { InformationDialogComponent } from './information-dialog/information-dialog.component';

import { ReportTemplateService } from 'src/app/_shared/services/http/report-template.service';

import { HistoricalReportResultsResolve } from 'src/app/_shared/resolves/historical-report-results.resolve';

const routes: Routes = [
  {
    path: '',
    component: ResultsComponent,
    resolve: {
      results: HistoricalReportResultsResolve
    }
  }
];

@NgModule({
  declarations: [ResultsComponent, InformationDialogComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    TranslateModule,
  ],
  providers: [ReportTemplateService, HistoricalReportResultsResolve]
})
export class ResultsModule {}
