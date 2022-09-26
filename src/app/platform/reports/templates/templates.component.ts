import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { DataTableComponent } from 'src/app/_shared/components/data-table/data-table.component';

import { NotificationService } from 'src/app/_shared/services/generic/notification.service';
import { ReportTemplateService } from 'src/app/_shared/services/http/report-template.service';
import { UserSessionService } from 'src/app/_shared/services/state/user-session.service';

@Component({
  selector: 'app-templates',
  templateUrl: './templates.component.html'
})
export class TemplatesComponent {

  @ViewChild(DataTableComponent, { static: true }) dataTable: DataTableComponent;

  readonly columns = [
    { label: 'report_name', name: 'name' },
    { label: 'data_world', name: 'module' },
    { label: 'description', name: 'description' }
  ];

  constructor(private route: ActivatedRoute,
              private reportService: ReportTemplateService,
              private notificationService: NotificationService,
              public userSession: UserSessionService) {}

  fetchItems(): void {
    this.reportService.getReports(this.dataTable.criteria).then(response => {
      this.dataTable.setItems(response);
    })
  }

  deleteItem(reportId: number): void {
    this.notificationService.warning().then(confirmation => {
      if (confirmation.value) {
        this.reportService.deleteReport(reportId).then(response => {
          if (response) {
            this.notificationService.success();
            this.fetchItems();
          }
        });
      }
    })
  }
}
