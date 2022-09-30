import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';

import { DataTableModule } from 'src/app/_shared/components/data-table/data-table.module';
import { TranslateModule } from 'src/app/_shared/pipes/translate/translate.module';

import { TemplatesComponent } from './templates.component';

import { ReportTemplateService } from 'src/app/_shared/services/http/report-template.service';

const routes: Routes = [
  { path: '', component: TemplatesComponent },
  { path: 'form', loadChildren: () => import('./form/form.module').then(m => m.FormModule) }
];

@NgModule({
  declarations: [TemplatesComponent],
  imports: [
    RouterModule.forChild(routes),
    TranslateModule,
    DataTableModule,
    MatDialogModule
  ],
  providers: [ReportTemplateService]
})
export class TemplatesModule {}
