import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { DataTableComponent } from 'src/app/_shared/components/data-table/data-table.component';

import { NotificationService } from 'src/app/_shared/services/generic/notification.service';
import { ReportSetService } from 'src/app/_shared/services/http/report-set.service';
import { UserSessionService } from 'src/app/_shared/services/state/user-session.service';

import { TranslatePipe } from 'src/app/_shared/pipes/translate/translate.pipe';

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
              public userSession: UserSessionService,
              private t: TranslatePipe) {}

  fetchItems(): void {
    this.reportSetService.getReportSets(this.dataTable.criteria).then(response => {
      this.dataTable.setItems(response);
    })
  }

  deleteReportSet(reportSetId: number): void {
    this.notificationService.warning().then(confirmation => {
      if (confirmation.value) {
        this.reportSetService.deleteReportSet(reportSetId).then(response => {
          if (response) {
            const msg = this.t.transform('report_set_deleted');
            this.notificationService.success(msg);

            this.fetchItems();
          }
        });
      }
    })
  }
}
