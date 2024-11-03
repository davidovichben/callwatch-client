import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FileSaverModule } from 'ngx-filesaver';

import { TranslateModule } from 'src/app/_shared/pipes/translate/translate.module';
import { DataTableModule } from '../../../../_shared/components/data-table/data-table.module';

import { ResultsComponent } from './results.component';

import { ReportTemplateService } from 'src/app/_shared/services/http/report-template.service';
import { ReportsService } from 'src/app/_shared/services/http/reports.service';

const routes: Routes = [
  {
    path: '',
    component: ResultsComponent
  }
];

@NgModule({
  declarations: [ResultsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatButtonModule,
    MatIconModule,
    TranslateModule,
    FileSaverModule,
    DataTableModule
  ],
  providers: [
    ReportTemplateService,
    ReportsService
  ]
})
export class ResultsModule {}
