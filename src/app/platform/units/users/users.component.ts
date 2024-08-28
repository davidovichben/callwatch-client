import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

import { FormComponent } from 'src/app/platform/units/users/form/form.component';

import { UnitUserService } from 'src/app/_shared/services/http/unit-user.service';
import { UserSessionService } from 'src/app/_shared/services/state/user-session.service';
import { NotificationService } from 'src/app/_shared/services/generic/notification.service';

import { UnitModel } from 'src/app/_shared/models/unit.model';
import { UserModel } from 'src/app/_shared/models/user.model';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html'
})
export class UsersComponent implements OnInit, OnDestroy {

  readonly sub = new Subscription();

  unit: UnitModel;

  users: UserModel[] = [];

  unitUsers: UserModel[] = [];
  parentUsers: UserModel[] = [];

  isRootUser = false;
  isRootUnit = false;

  constructor(private dialog: MatDialog, private route: ActivatedRoute,
              public userSession: UserSessionService,
              private notifications: NotificationService,
              private unitUserService: UnitUserService) {}

  ngOnInit(): void {
    this.sub.add(this.route.data.subscribe(data => {
      this.unit = this.route.parent.parent.snapshot.data.unit;

      this.isRootUnit = this.unit._id === 'root';
      this.isRootUser = this.userSession.isRootUser();

      this.users = data.users;
      this.unitUsers = data.unitUsers.unit;
      this.parentUsers = data.unitUsers.parent;
    }));
  }

  openUserDialog(): void {
    const dialog = this.dialog.open(FormComponent, {
      width: '400px',
      panelClass: 'no-overflow',
      data: {
        unitId: this.unit._id,
        users: this.users
      }
    })

    this.sub.add(dialog.afterClosed().subscribe(async (saved) => {
      if (saved) {
        const response = await this.unitUserService.getUsers(this.unit._id);
        this.unitUsers = response.unit;
      }
    }));
  }

  async deleteUser(userId: string): Promise<void> {
    const confirmation = await this.notifications.warning();
    if (confirmation.value) {
      const response = await this.unitUserService.deleteUser(this.unit._id, userId);
      if (response) {
        const users = await this.unitUserService.getUsers(this.unit._id);
        this.unitUsers = users.unit;
      }
    }
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}
