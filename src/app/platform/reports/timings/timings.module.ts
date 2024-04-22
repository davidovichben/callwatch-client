import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';

import { TranslateModule } from 'src/app/_shared/pipes/translate/translate.module';
import { DataTableModule } from 'src/app/_shared/components/data-table/data-table.module';

import { TimingsComponent } from './timings.component';

import { ReportTimingService } from 'src/app/_shared/services/http/report-timing.service';

const routes: Routes = [
  { path: '', component: TimingsComponent },
  { path: 'form', loadChildren: () => import('./form/form.module').then(m => m.FormModule) }
];

@NgModule({
  declarations: [TimingsComponent],
  imports: [
    RouterModule.forChild(routes),
    DataTableModule,
    TranslateModule,
    MatDialogModule
  ],
  providers: [ReportTimingService]
})
export class TimingsModule {}
