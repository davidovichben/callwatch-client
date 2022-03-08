import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { DataTableComponent } from 'src/app/_shared/components/data-table/data-table.component';

import { NotificationService } from 'src/app/_shared/services/generic/notification.service';
import { ReportSetService } from 'src/app/_shared/services/http/report-set.service';
import { UserSessionService } from 'src/app/_shared/services/state/user-session.service';

@Component({
  selector: 'app-sets',
  templateUrl: './sets.component.html'
})
export class SetsComponent {

  @ViewChild(DataTableComponent, { static: true }) dataTable: DataTableComponent;

  readonly columns = [
    { label: 'set_name', name: 'name' },
    { label: 'total_reports', name: 'totalReports' }
  ];

  constructor(private dialog: MatDialog,
              private route: ActivatedRoute,
              private reportSetService: ReportSetService,
              private notificationService: NotificationService,
              public userSession: UserSessionService) {}

  fetchItems(): void {
    this.reportSetService.getReportSets(this.dataTable.criteria).then(response => {
      this.dataTable.setItems(response);
    })
  }

  deleteItem(reportSetId: number): void {
    this.notificationService.warning().then(confirmation => {
      if (confirmation.value) {
        this.reportSetService.deleteReportSet(reportSetId).then(response => {
          if (response) {
            this.notificationService.success();
            this.fetchItems();
          }
        });
      }
    })
  }
}
