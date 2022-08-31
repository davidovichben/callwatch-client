import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { DataTableComponent } from 'src/app/_shared/components/data-table/data-table.component';
import { MultipleEditComponent } from 'src/app/platform/settings/schedules/multiple-edit/multiple-edit.component';

import { ScheduleService } from 'src/app/_shared/services/http/schedule.service';
import { UserSessionService } from 'src/app/_shared/services/state/user-session.service';
import { NotificationService } from 'src/app/_shared/services/generic/notification.service';

import { TranslatePipe } from 'src/app/_shared/pipes/translate/translate.pipe';

import { SelectItemModel } from 'src/app/_shared/models/select-item.model';

@Component({
  selector: 'app-schedules',
  templateUrl: './schedules.component.html'
})
export class SchedulesComponent implements OnInit {

  @ViewChild(DataTableComponent, { static: true }) dataTable: DataTableComponent;

  readonly sub = new Subscription();

  uniqueSchedules: SelectItemModel[] = [];

  readonly columns = [
    { label: 'name', name: 'name' },
    { label: 'type', name: 'type' },
    { label: 'unique_schedule', name: 'uniqueSchedule' }
  ];

  constructor(private scheduleService: ScheduleService, private t: TranslatePipe,
              private dialog: MatDialog, private notification: NotificationService,
              public userSession: UserSessionService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.uniqueSchedules = this.route.snapshot.data.uniqueSchedules;
  }

  fetchItems(): void {
    this.scheduleService.getSchedules(this.dataTable.criteria).then(response => {
      this.dataTable.setItems(response);
    });
  }

  openMultipleEdit(): void {
    const checkedItems = this.dataTable.criteria.checkedItems;

    if (checkedItems.length === 0) {
      this.notification.error(this.t.transform('no_items_selected'));
      return;
    }

    const dialog = this.dialog.open(MultipleEditComponent, {
      data: {
        checkedItems,
        uniqueSchedules: this.uniqueSchedules
      },
      width: '600px',
      height: '600px'
    })

    const sub = dialog.afterClosed().subscribe(updated => {
      if (updated) {
        this.fetchItems();
        this.notification.success()
      }
    });

    this.sub.add(sub);
  }

  deleteItem(scheduleId: number): void {
    this.notification.warning().then(confirmation => {
      if (confirmation.value) {
        this.scheduleService.deleteSchedule(scheduleId).then(response => {
          if (response) {
            this.notification.success();
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
