import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { TranslateModule } from 'src/app/_shared/pipes/translate/translate.module';
import { DataTableModule } from 'src/app/_shared/components/data-table/data-table.module';

import { SetsComponent } from './sets.component';

import { ReportService } from 'src/app/_shared/services/http/report.service';
import { ReportSetService } from 'src/app/_shared/services/http/report-set.service';

const routes: Routes = [
  { path: '', component: SetsComponent },
  { path: 'form', loadChildren: () => import('./form/form.module').then(m => m.FormModule) }
];

@NgModule({
  declarations: [SetsComponent],
  imports: [
    RouterModule.forChild(routes),
    MatDialogModule,
    MatIconModule,
    DataTableModule,
    TranslateModule
  ],
  providers: [
    ReportService,
    ReportSetService
  ]
})
export class SetsModule {}
