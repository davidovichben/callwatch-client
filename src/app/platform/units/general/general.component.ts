import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

import { FormComponent } from 'src/app/platform/units/general/form/form.component';

import { UserSessionService } from 'src/app/_shared/services/state/user-session.service';
import { NotificationService } from 'src/app/_shared/services/generic/notification.service';
import { UnitUserService } from 'src/app/_shared/services/http/unit-user.service';
import { UnitService } from 'src/app/_shared/services/http/unit.service';

import { UnitModel } from 'src/app/_shared/models/unit.model';

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.styl']
})
export class GeneralComponent implements OnInit, OnDestroy {

  readonly sub = new Subscription();

  unit = new UnitModel();
  permissions = [];
  organizationUsers = [];

  isRoot = false;

  constructor(private route: ActivatedRoute,
              private dialog: MatDialog,
              private userSession: UserSessionService,
              private notification: NotificationService,
              private unitUserService: UnitUserService,
              private unitService: UnitService) {}

  ngOnInit(): void {
    this.unit = this.route.snapshot.data.unit;
    this.organizationUsers = this.route.snapshot.data.users;
    this.permissions = this.route.snapshot.data.permissions;
  }

  hasPermission(module: string, action: string): boolean {
    return this.userSession.hasPermission(this.unit.id, module, action);
  }

  openUserDialog(userId?: number): void {
    const dialog = this.dialog.open(FormComponent, {
      width: '400px',
      data: { userId, unitId: this.unit.id }
    })

    this.sub.add(dialog.afterClosed().subscribe(saved => {
      if (saved) {
        this.unitUserService.getUnitUsers(this.unit.id).then(response => {
          this.unit.users = response;
        });
      }
    }));
  }

  deleteUser(userId: number, index: number): void {
    this.notification.warning().then(confirmation => {
      if (confirmation.value) {
        this.unitUserService.deleteUserUnit(this.unit.id, userId).then(response => {
          if (response) {
            this.unit.users.splice(index, 1);
          }
        })
      }
    });
  }

  submit(form: NgForm): void {
    this.unitService.updateUnit(this.unit.id, form.value).then(response => {
      if (response) {
        this.notification.success();
      }
    })
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
