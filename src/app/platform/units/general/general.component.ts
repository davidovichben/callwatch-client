import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

import { FormComponent } from 'src/app/platform/units/general/form/form.component';

import { UserSessionService } from 'src/app/_shared/services/state/user-session.service';
import { NotificationService } from 'src/app/_shared/services/generic/notification.service';
import { UnitPermissionEntityService } from 'src/app/_shared/services/http/unit-permission-entity.service';
import { UnitService } from 'src/app/_shared/services/http/unit.service';

import { UnitModel } from 'src/app/_shared/models/unit.model';
import { PermissionEntityModel } from 'src/app/_shared/models/permission-entity.model';

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.styl']
})
export class GeneralComponent implements OnInit, OnDestroy {

  readonly sub = new Subscription();

  unit = new UnitModel();
  permissions = [];
  users = [];
  groups = [];

  isRoot = false;

  constructor(private route: ActivatedRoute,
              private dialog: MatDialog,
              private userSession: UserSessionService,
              private notification: NotificationService,
              private unitPermissionEntityService: UnitPermissionEntityService,
              private unitService: UnitService) {}

  ngOnInit(): void {
    this.users = this.route.snapshot.data.users;
    this.groups = this.route.snapshot.data.groups;

    this.sub.add(this.route.data.subscribe(data => {
      this.unit = data.unit;
      this.isRoot = this.unit.id === 'root';
    }));
  }

  hasPermission(module: string, action: string): boolean {
    return this.userSession.hasPermission(this.unit.id, module, action);
  }

  openPermissionEntityDialog(type: string): void {
    const permissionEntities = type === 'group' ? this.groups : this.users;

    const dialog = this.dialog.open(FormComponent, {
      width: '400px',
      data: {
        unitId: this.unit.id,
        permissionEntities,
        type
      }
    })

    this.sub.add(dialog.afterClosed().subscribe(saved => {
      if (saved) {
        this.unitPermissionEntityService.getPermissionEntities(this.unit.id, type).then(response => {
          const attr = type === 'user' ? 'users' : 'groups';
          this.unit[attr] = response;
        });
      }
    }));
  }

  deletePermissionEntity(permissionEntityId: number, index: number): void {
    this.notification.warning().then(confirmation => {
      if (confirmation.value) {
        this.unitPermissionEntityService.deletePermissionEntity(this.unit.id, permissionEntityId).then(response => {
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
