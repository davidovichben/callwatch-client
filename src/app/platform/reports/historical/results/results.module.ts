import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { FileSaverModule } from 'ngx-filesaver';

import { TranslateModule } from 'src/app/_shared/pipes/translate/translate.module';
import { DualGroupsSelectModule } from 'src/app/_shared/components/dual-groups-select/dual-groups-select.module';
import { DataTableModule } from 'src/app/_shared/components/data-table/data-table.module';

import { ResultsComponent } from './results.component';
import { InformationDialogComponent } from './information-dialog/information-dialog.component';
import { ColumnsDialogComponent } from './columns-dialog/columns-dialog.component';
import { QueryDialogComponent } from './query-dialog/query-dialog.component';

import { ReportTemplateService } from 'src/app/_shared/services/http/report-template.service';
import { ReportsService } from 'src/app/_shared/services/http/reports.service';

const routes: Routes = [
  {
    path: '',
    component: ResultsComponent
  }
];

@NgModule({
  declarations: [
    ResultsComponent,
    InformationDialogComponent,
    ColumnsDialogComponent,
    QueryDialogComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    FileSaverModule,
    TranslateModule,
    DualGroupsSelectModule,
    DataTableModule
  ],
  providers: [
    ReportTemplateService,
    ReportsService
  ]
})
export class ResultsModule {}
