import { Component, ViewChild } from '@angular/core';

import { DataTableComponent } from 'src/app/_shared/components/data-table/data-table.component';

import { AuditTrailService } from 'src/app/_shared/services/http/audit-trail.service';

@Component({
  selector: 'app-audit-trail',
  templateUrl: './audit-trail.component.html'
})
export class AuditTrailComponent {

  @ViewChild(DataTableComponent, { static: true }) dataTable: DataTableComponent;

  readonly columns = [
    { label: 'time', name: 'created' },
    { label: 'event', name: 'resource' },
    { label: 'ip_address', name: 'ip' }
  ];

  constructor(private auditTrailService: AuditTrailService) {}

  fetchItems(): void {
    this.auditTrailService.getLogs(this.dataTable.criteria).then(response => {
      this.dataTable.setItems(response);
    });
  }
}
