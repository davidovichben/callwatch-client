import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormModule } from './form/form.module';
import { MatDialogModule } from '@angular/material/dialog';

import { TranslateModule } from 'src/app/_shared/pipes/translate/translate.module';
import { DataTableModule } from 'src/app/_shared/components/data-table/data-table.module';

import { SetsComponent } from './sets.component';

import { ReportService } from 'src/app/_shared/services/http/report.service';
import { ReportSetService } from 'src/app/_shared/services/http/report-set.service';

import { ReportTypesSelectResolve } from 'src/app/_shared/resolves/report-types-select.resolve';

import { TranslatePipe } from 'src/app/_shared/pipes/translate/translate.pipe';

const routes: Routes = [
  {
    path: '',
    component: SetsComponent,
    resolve: { types: ReportTypesSelectResolve }
  }
];

@NgModule({
  declarations: [SetsComponent],
  imports: [
    RouterModule.forChild(routes),
    MatDialogModule,
    DataTableModule,
    TranslateModule,
    FormModule
  ],
  providers: [
    ReportService,
    ReportSetService,
    ReportTypesSelectResolve,
    TranslatePipe
  ]
})
export class SetsModule {}
