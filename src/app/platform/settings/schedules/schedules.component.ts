import { Component, ViewChild } from '@angular/core';

import { DataTableComponent } from 'src/app/_shared/components/data-table/data-table.component';

import { ScheduleService } from 'src/app/_shared/services/http/schedule.service';
import { UserSessionService } from 'src/app/_shared/services/state/user-session.service';
import { NotificationService } from 'src/app/_shared/services/generic/notification.service';

@Component({
  selector: 'app-schedules',
  templateUrl: './schedules.component.html'
})
export class SchedulesComponent {

  @ViewChild(DataTableComponent, { static: true }) dataTable: DataTableComponent;

  readonly columns = [
    { label: 'name', name: 'name' },
    { label: 'type', name: 'type' },
    { label: 'unique_schedule', name: 'uniqueSchedule' }
  ];

  constructor(private scheduleService: ScheduleService,
              public userSession: UserSessionService,
              private notifications: NotificationService) {}

  fetchItems(): void {
    this.scheduleService.getSchedules(this.dataTable.criteria).then(response => {
      this.dataTable.setItems(response);
    });
  }

  deleteItem(scheduleId: number): void {
    this.notifications.warning().then(confirmation => {
      if (confirmation.value) {
        this.scheduleService.deleteSchedule(scheduleId).then(response => {
          if (response) {
            this.notifications.success();
            this.fetchItems();
          }
        })
      }
    });
  }
}
