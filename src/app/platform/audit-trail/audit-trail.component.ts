import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';

import { DataTableComponent } from 'src/app/_shared/components/data-table/data-table.component';
import { ChangesComponent } from './changes/changes.component';

import { AuditTrailService } from 'src/app/_shared/services/http/audit-trail.service';

import { AuditTrailEntryModel } from 'src/app/_shared/models/audit-trail-entry.model';

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

  constructor(private router: Router, private dialog: MatDialog,
              private auditTrailService: AuditTrailService) {}

  fetchItems(): void {
    this.auditTrailService.getLogs(this.dataTable.criteria).then(response => {
      this.dataTable.setItems(response);
    });
  }

  navigateToResource(item: AuditTrailEntryModel): void {
    let url;
    if (item.resourceType === 'unit') {
      url = ['/platform', 'units', item.resourceId];
    } else {
      url = ['/platform', 'settings', item.resourceType + 's', 'form', item.resourceId]
    }

    this.router.navigate(url);
  }

  openChangesDialog(entryId: number): void {
    this.auditTrailService.getChanges(entryId).then(changes => {
      if (changes) {
        this.dialog.open(ChangesComponent, {
          data: changes,
          width: '600px'
        })
      }
    })
  }
}
