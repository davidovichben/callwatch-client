import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { DataTableComponent } from 'src/app/_shared/components/data-table/data-table.component';

import { NotificationService } from 'src/app/_shared/services/generic/notification.service';
import { UserSessionService } from 'src/app/_shared/services/state/user-session.service';
import { ReportTimingService } from 'src/app/_shared/services/http/report-timing.service';

@Component({
  selector: 'app-timings',
  templateUrl: './timings.component.html'
})
export class TimingsComponent {

  @ViewChild(DataTableComponent, { static: true }) dataTable: DataTableComponent;

  readonly columns = [
    { label: 'name', name: 'name' },
    { label: 'data_sphere', name: 'module' },
    { label: 'description', name: 'description' },
    { label: 'next_production_date', name: 'nextDate' },
    { label: 'status', name: 'status' },
  ];

  constructor(private route: ActivatedRoute,
              private reportService: ReportTimingService,
              private notificationService: NotificationService,
              public userSession: UserSessionService) {}

  fetchItems(): void {
    this.reportService.getReportTimings(this.dataTable.criteria).then(response => {
      this.dataTable.setItems(response);
    })
  }

  deleteItem(reportSetId: number): void {
    this.notificationService.warning().then(confirmation => {
      if (confirmation.value) {
        // this.reportSetService.deleteReportSet(reportSetId).then(response => {
        //   if (response) {
        //     this.notificationService.success();
        //     this.fetchItems();
        //   }
        // });
      }
    })
  }
}
