import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { DataTableComponent } from 'src/app/_shared/components/data-table/data-table.component';

import { AuditTrailService } from 'src/app/_shared/services/http/audit-trail.service';

import { AuditLogEntryModel } from 'src/app/_shared/models/audit-log-entry.model';

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

  constructor(private router: Router, private auditTrailService: AuditTrailService) {}

  fetchItems(): void {
    this.auditTrailService.getLogs(this.dataTable.criteria).then(response => {
      this.dataTable.setItems(response);
    });
  }

  navigateToResource(item: AuditLogEntryModel): void {
    let url;
    if (item.resourceType === 'unit') {
      url = ['/platform', 'units', item.resourceId];
    } else {
      url = ['/platform', 'settings', item.resourceType + 's', 'form', item.resourceId]
    }

    this.router.navigate(url);
  }
}
