import { Component, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { DataTableComponent } from 'src/app/_shared/components/data-table/data-table.component';

import { NotificationService } from 'src/app/_shared/services/generic/notification.service';
import { GroupService } from 'src/app/_shared/services/http/group.service';

import { TranslatePipe } from 'src/app/_shared/pipes/translate/translate.pipe';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html'
})
export class GroupsComponent implements OnDestroy {

  readonly sub = new Subscription();

  @ViewChild(DataTableComponent, { static: true }) dataTable: DataTableComponent;

  readonly columns = [
    { label: 'group_name', name: 'name' },
    { label: 'total_users', name: 'totalMembers' }
  ];

  constructor(private route: ActivatedRoute,
              private groupService: GroupService,
              private notificationService: NotificationService,
              private t: TranslatePipe) {}

  fetchItems(): void {
    this.groupService.getGroups(this.dataTable.criteria).then(response => {
      this.dataTable.setItems(response);
    })
  }

  deleteGroup(groupId: number): void {
    this.notificationService.warning().then(confirmation => {
      if (confirmation.value) {
        this.groupService.deleteGroup(groupId).then(response => {
          if (response) {
            const msg = this.t.transform('group_deleted');
            this.notificationService.success(msg);

            this.fetchItems();
          }
        });
      }
    })
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
