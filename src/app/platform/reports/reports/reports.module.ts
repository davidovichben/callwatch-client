import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DataTableModule } from 'src/app/_shared/components/data-table/data-table.module';
import { TranslateModule } from 'src/app/_shared/pipes/translate/translate.module';

import { ReportsComponent } from './reports.component';

import { ReportService } from 'src/app/_shared/services/http/report.service';

import { TranslatePipe } from 'src/app/_shared/pipes/translate/translate.pipe';

const routes: Routes = [
  { path: '', component: ReportsComponent },
  { path: 'form', loadChildren: () => import('./form/form.module').then(m => m.FormModule) }
];

@NgModule({
  declarations: [ReportsComponent],
  imports: [
    RouterModule.forChild(routes),
    TranslateModule,
    DataTableModule
  ],
  providers: [ReportService, TranslatePipe]
})
export class ReportsModule {}
