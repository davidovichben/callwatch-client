import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { DataTableComponent } from 'src/app/_shared/components/data-table/data-table.component';

import { UserService } from 'src/app/_shared/services/http/user.service';
import { UserSessionService } from 'src/app/_shared/services/state/user-session.service';
import { NotificationService } from 'src/app/_shared/services/generic/notification.service';

import { UserModel } from 'src/app/_shared/models/user.model';
import { SelectItemModel } from 'src/app/_shared/models/select-item.model';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html'
})
export class UsersComponent {

  @ViewChild(DataTableComponent, { static: true }) dataTable: DataTableComponent;

  readonly columns = [
    { label: 'full_name', name: 'name' },
    { label: 'permission', name: 'permission' },
    { label: 'phone', name: 'phone' },
    { label: 'email', name: 'username' }
  ];

  currentUser: UserModel;

  permissions: SelectItemModel[] = [];

  constructor(private route: ActivatedRoute,
    public userSession: UserSessionService,
    private userService: UserService,
    private notificationService: NotificationService) {}

  ngOnInit() {
    this.currentUser = this.userSession.getUser();
    this.permissions = this.route.snapshot.data.permissions;
  }

  fetchItems(): void {
    this.userService.getUsers(this.dataTable.criteria).then(response => {
      this.dataTable.setItems(response);
    })
  }

  deleteItem(userId: number): void {
    this.notificationService.warning().then(confirmation => {
      if (confirmation.value) {
        this.userService.deleteUser(userId).then(response => {
          if (response) {
            this.notificationService.success();
            this.fetchItems();
          }
        });
      }
    });
  }
}
