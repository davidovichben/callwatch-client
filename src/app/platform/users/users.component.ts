import { Component, ViewChild } from '@angular/core';

import { DataTableComponent } from 'src/app/_shared/components/data-table/data-table.component';

import { UserService } from 'src/app/_shared/services/http/user.service';
import { UserSessionService } from 'src/app/_shared/services/state/user-session.service';
import { NotificationService } from 'src/app/_shared/services/generic/notification.service';

import { TranslatePipe } from 'src/app/_shared/pipes/translate/translate.pipe';

import { UserModel } from 'src/app/_shared/models/user.model';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html'
})
export class UsersComponent {

  @ViewChild(DataTableComponent, { static: true }) dataTable: DataTableComponent;

  readonly columns = [
    { label: 'full_name', name: 'name' },
    { label: 'phone', name: 'phone' }
  ];

  currentUser: UserModel;

  constructor(public userSession: UserSessionService,
              private userService: UserService,
              private notificationService: NotificationService,
              private t: TranslatePipe) {}

  ngOnInit() {
    this.currentUser = this.userSession.getUser();
  }

  fetchItems(): void {
    this.userService.getUsers(this.dataTable.criteria).then(response => {
      this.dataTable.setItems(response);
    })
  }

  deleteUser(userId: number): void {
    this.notificationService.warning().then(confirmation => {
      if (confirmation.value) {
        this.userService.deleteUser(userId).then(response => {
          if (response) {
            const msg = this.t.transform('user_deleted');
            this.notificationService.success(msg);
            this.fetchItems();
          }
        });
      }
    });
  }
}
