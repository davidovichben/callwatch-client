import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';

import { TranslateModule } from 'src/app/_shared/pipes/translate/translate.module';
import { DataTableModule } from 'src/app/_shared/components/data-table/data-table.module';

import { ReportSetsComponent } from './report-sets.component';

import { ReportService } from 'src/app/_shared/services/http/report.service';
import { ReportSetService } from 'src/app/_shared/services/http/report-set.service';

const routes: Routes = [
  { path: '', component: ReportSetsComponent },
  { path: 'form', loadChildren: () => import('./form/form.module').then(m => m.FormModule) }
];

@NgModule({
  declarations: [ReportSetsComponent],
  imports: [
    RouterModule.forChild(routes),
    MatDialogModule,
    DataTableModule,
    TranslateModule
  ],
  providers: [
    ReportService,
    ReportSetService
  ]
})
export class ReportSetsModule {}
