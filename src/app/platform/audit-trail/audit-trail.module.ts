import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DataTableModule } from 'src/app/_shared/components/data-table/data-table.module';
import { TranslateModule } from 'src/app/_shared/pipes/translate/translate.module';

import { AuditTrailComponent } from 'src/app/platform/audit-trail/audit-trail.component';

import { AuditTrailService } from 'src/app/_shared/services/http/audit-trail.service';

const routes: Routes = [
  { path: '', component: AuditTrailComponent },
];

@NgModule({
  declarations: [AuditTrailComponent],
  imports: [
    RouterModule.forChild(routes),
    TranslateModule,
    DataTableModule,
  ],
  providers: [AuditTrailService]
})
export class AuditTrailModule {}
