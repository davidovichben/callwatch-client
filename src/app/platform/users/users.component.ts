import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

import { DataTableComponent } from 'src/app/_shared/components/data-table/data-table.component';
import { MultipleEditComponent } from './multiple-edit/multiple-edit.component';

import { UserService } from 'src/app/_shared/services/http/user.service';
import { UserSessionService } from 'src/app/_shared/services/state/user-session.service';
import { NotificationService } from 'src/app/_shared/services/generic/notification.service';

import { UserModel } from 'src/app/_shared/models/user.model';
import { SelectItemModel } from 'src/app/_shared/models/select-item.model';
import { UnitModel } from 'src/app/_shared/models/unit.model';

import { TranslatePipe } from 'src/app/_shared/pipes/translate/translate.pipe';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html'
})
export class UsersComponent {

  @ViewChild(DataTableComponent, { static: true }) dataTable: DataTableComponent;

  readonly sub = new Subscription();

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
    private notificationService: NotificationService,
    private t: TranslatePipe,
    private dialog: MatDialog) {}

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
    const checkedItems = this.dataTable.criteria.checkedItems;

    if (checkedItems.length === 0) {
      this.notificationService.error(this.t.transform('no_items_selected'));
      return;
    }

    const dialog = this.dialog.open(MultipleEditComponent, {
      data: {
        checkedItems,
        units: this.units,
        permissions: this.permissions,
        loggedUser: this.currentUser
      },
      width: '600px'
    })

    const sub = dialog.afterClosed().subscribe(updated => {
      if (updated) {
        this.fetchItems();
        this.dataTable.criteria.checkedItems = [];
        this.notificationService.success()
      }
    });

    this.sub.add(sub);
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

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
