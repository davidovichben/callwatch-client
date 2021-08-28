import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { DataTableComponent } from 'src/app/_shared/components/data-table/data-table.component';

import { NotificationService } from 'src/app/_shared/services/generic/notification.service';
import { ReportService } from 'src/app/_shared/services/http/report.service';

import { TranslatePipe } from 'src/app/_shared/pipes/translate/translate.pipe';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html'
})
export class ReportsComponent {

  @ViewChild(DataTableComponent, { static: true }) dataTable: DataTableComponent;

  readonly columns = [
    { label: 'report_name', name: 'name' }
  ];

  constructor(private route: ActivatedRoute,
              private reportService: ReportService,
              private notificationService: NotificationService,
              private t: TranslatePipe) {}

  fetchItems(): void {
    this.reportService.getReports(this.dataTable.criteria).then(response => {
      this.dataTable.setItems(response);
    })
  }

  deleteReport(reportId: number): void {
    this.notificationService.warning().then(confirmation => {
      if (confirmation.value) {
        this.reportService.deleteReport(reportId).then(response => {
          if (response) {
            const msg = this.t.transform('report_deleted');
            this.notificationService.success(msg);

            this.fetchItems();
          }
        });
      }
    })
  }
}
