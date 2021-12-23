import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DataTableModule } from 'src/app/_shared/components/data-table/data-table.module';
import { TranslateModule } from 'src/app/_shared/pipes/translate/translate.module';

import { AuditLogComponent } from './audit-log.component';

import { AuditLogService } from 'src/app/_shared/services/http/audit-log.service';

const routes: Routes = [
  { path: '', component: AuditLogComponent },
];

@NgModule({
  declarations: [AuditLogComponent],
  imports: [
    RouterModule.forChild(routes),
    TranslateModule,
    DataTableModule,
  ],
  providers: [AuditLogService]
})
export class AuditLogModule {}
