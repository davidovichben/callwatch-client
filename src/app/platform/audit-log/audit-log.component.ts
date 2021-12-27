import { Component, ViewChild } from '@angular/core';

import { DataTableComponent } from 'src/app/_shared/components/data-table/data-table.component';

import { AuditLogService } from 'src/app/_shared/services/http/audit-log.service';

@Component({
  selector: 'app-audit-log',
  templateUrl: './audit-log.component.html'
})
export class AuditLogComponent {

  @ViewChild(DataTableComponent, { static: true }) dataTable: DataTableComponent;

  readonly columns = [
    { label: 'time', name: 'created' },
    { label: 'event', name: 'resource' },
    { label: 'ip_address', name: 'ip' }
  ];

  constructor(private auditLogService: AuditLogService) {}

  fetchItems(): void {
    this.auditLogService.getLogs(this.dataTable.criteria).then(response => {
      this.dataTable.setItems(response);
    });
  }
}
