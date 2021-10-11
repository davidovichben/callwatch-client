import { Component, OnDestroy, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

import { DataTableComponent } from 'src/app/_shared/components/data-table/data-table.component';
import { FormComponent } from 'src/app/platform/schedules/form/form.component';

import { ScheduleService } from 'src/app/_shared/services/http/schedule.service';
import { UserSessionService } from 'src/app/_shared/services/state/user-session.service';
import { NotificationService } from 'src/app/_shared/services/generic/notification.service';

import { TranslatePipe } from 'src/app/_shared/pipes/translate/translate.pipe';
import { ScheduleModel } from 'src/app/_shared/models/schedule.model';

@Component({
  selector: 'app-schedules',
  templateUrl: './schedules.component.html'
})
export class SchedulesComponent implements OnDestroy {

  @ViewChild(DataTableComponent, { static: true }) dataTable: DataTableComponent;

  readonly sub = new Subscription();

  readonly columns = [
    { label: 'name', name: 'name' },
    { label: 'description', name: 'description' }
  ];

  constructor(private scheduleService: ScheduleService,
              public userSession: UserSessionService,
              private dialog: MatDialog,
              private notifications: NotificationService,
              private t: TranslatePipe) {}

  fetchItems(): void {
    this.scheduleService.getSchedules(this.dataTable.criteria).then(response => {
      this.dataTable.setItems(response);
    });
  }

  openFormDialog(schedule?: ScheduleModel): void {
    const dialog = this.dialog.open(FormComponent, {
      width: '800px',
      data: schedule ? schedule : new ScheduleModel()
    });

    this.sub.add(dialog.afterClosed().subscribe(saved => {
      if (saved) {
        this.fetchItems();
      }
    }));
  }

  deleteSchedule(scheduleId: number): void {
    this.notifications.warning().then(confirmation => {
      if (confirmation.value) {
        this.scheduleService.deleteSchedule(scheduleId).then(response => {
          if (response) {
            const msg = this.t.transform('schedule_deleted');
            this.notifications.success(msg);
            this.fetchItems();
          }
        })
      }
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
