import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

import { DataTableComponent } from 'src/app/_shared/components/data-table/data-table.component';
import { FormComponent } from './form/form.component';

import { NotificationService } from 'src/app/_shared/services/generic/notification.service';
import { GroupService } from 'src/app/_shared/services/http/group.service';

import { TranslatePipe } from 'src/app/_shared/pipes/translate/translate.pipe';

import { GroupModel } from 'src/app/_shared/models/group.model';
import { SelectItemModel } from 'src/app/_shared/models/select-item.model';
import { ReportSetModel } from 'src/app/_shared/models/report-set.model';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html'
})
export class GroupsComponent implements OnInit, OnDestroy {

  readonly sub = new Subscription();

  @ViewChild(DataTableComponent, { static: true }) dataTable: DataTableComponent;

  readonly columns = [
    { label: 'group_name', name: 'name' },
    { label: 'total_users', name: 'totalMembers' }
  ];

  users: SelectItemModel[] = [];

  constructor(private route: ActivatedRoute,
              private dialog: MatDialog,
              private groupService: GroupService,
              private notificationService: NotificationService,
              private t: TranslatePipe) {}

  ngOnInit() {
    this.users = this.route.snapshot.data.users;
  }

  fetchItems(): void {
    this.groupService.getGroups(this.dataTable.criteria).then(response => {
      this.dataTable.setItems(response);
    })
  }

  editGroup(groupId: number): void {
    this.groupService.getGroup(groupId).then(response => {
      this.openFormDialog(response);
    });
  }

  openFormDialog(group?: GroupModel): void {
    if (!group) {
      group = new GroupModel();
    }

    const dialog = this.dialog.open(FormComponent, {
      data: {
        group,
        users: this.users
      },
      width: '400px'
    })

    this.sub.add(dialog.afterClosed().subscribe(saved => {
      if (saved) {
        this.fetchItems();
      }
    }));
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
