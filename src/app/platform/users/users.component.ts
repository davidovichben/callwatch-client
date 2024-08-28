import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { DataTableComponent } from 'src/app/_shared/components/data-table/data-table.component';
import { MultipleEditComponent } from './multiple-edit/multiple-edit.component';

import { UserService } from 'src/app/_shared/services/http/user.service';
import { UserSessionService } from 'src/app/_shared/services/state/user-session.service';
import { NotificationService } from 'src/app/_shared/services/generic/notification.service';

import { UserModel } from 'src/app/_shared/models/user.model';
import { SelectItemModel } from 'src/app/_shared/models/select-item.model';
import { UnitModel } from 'src/app/_shared/models/unit.model';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html'
})
export class UsersComponent implements OnInit {

  @ViewChild(DataTableComponent, { static: true }) dataTable: DataTableComponent;

  readonly columns = [
    { label: 'full_name', name: 'name' },
    { label: 'username', name: 'username' },
    { label: 'permission', name: 'permission' },
    { label: 'unit', name: 'unit' },
    { label: 'phone', name: 'phone' },
    { label: 'email', name: 'email' }
  ];

  currentUser: UserModel;

  units: UnitModel[] = [];
  permissions: SelectItemModel[] = [];

  constructor(private route: ActivatedRoute,
    public userSession: UserSessionService,
    private userService: UserService,
    private notificationService: NotificationService) {}

  ngOnInit() {
    const routeData = this.route.snapshot.data;

    this.units = routeData.units;
    this.permissions = routeData.permissions;

    this.currentUser = this.userSession.getUser();
    this.permissions = this.route.snapshot.data.permissions;
  }

  fetchItems(): void {
    this.userService.getUsers(this.dataTable.criteria).then(response => {
      this.dataTable.setItems(response);
    })
  }

  openMultipleEdit(): void {
    const data = {
      units: this.units,
      permissions: this.permissions,
      loggedUser: this.currentUser
    }

    this.dataTable.openMultipleEditDialog(MultipleEditComponent, data)
  }

  async deleteItem(userId: string): Promise<void> {
    const confirmation = await this.notificationService.warning();
    if (confirmation.value) {
      const response = await this.userService.deleteUser(userId);
      if (response) {
        this.notificationService.success();
        this.fetchItems();
      }
    }
  }
}
