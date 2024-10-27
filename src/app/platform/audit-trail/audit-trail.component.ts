import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { NgForOf } from '@angular/common';

import { DataTableModule } from '../../_shared/components/data-table/data-table.module';
import { TranslateModule } from '../../_shared/pipes/translate/translate.module';

import { DataTableComponent } from 'src/app/_shared/components/data-table/data-table.component';
import { ChangesComponent } from './changes/changes.component';

import { AuditTrailService } from 'src/app/_shared/services/http/audit-trail.service';

import { AuditTrailEntryModel } from 'src/app/_shared/models/audit-trail-entry.model';


@Component({
  selector: 'app-audit-trail',
  templateUrl: './audit-trail.component.html',
  imports: [
    NgForOf,
    DataTableModule,
    TranslateModule,
    ChangesComponent
  ],
  standalone: true
})
export class AuditTrailComponent {

  @ViewChild(DataTableComponent, { static: true }) dataTable: DataTableComponent;

  readonly columns = [
    { label: 'time', name: 'created' },
    { label: 'event', name: 'resourceName' },
    { label: 'ip_address', name: 'ipAddress' }
  ];

  constructor(private router: Router, private dialog: MatDialog,
              private auditTrailService: AuditTrailService) {}

  async fetchItems(): Promise<void> {
    const response = await this.auditTrailService.getLogs(this.dataTable.criteria);
    this.dataTable.setItems(response);
  }

  navigateToResource(item: AuditTrailEntryModel): void {
    let url: any[];
    if (item.resourceType === 'unit') {
      url = ['/platform', 'units', item.resourceId];
    } else {
      url = ['/platform', 'settings', item.resourceType + 's', 'form', item.resourceId]
    }

    this.router.navigate(url);
  }

  async openChangesDialog(entryId: number): Promise<void> {
    const changes = await this.auditTrailService.getChanges(entryId)
    if (changes) {
      this.dialog.open(ChangesComponent, {
        data: changes,
        width: '600px'
      })
    }
  }
}
