import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

import { DataTableComponent } from 'src/app/_shared/components/data-table/data-table.component';
import { ReassignDialogComponent } from 'src/app/platform/settings/permissions/reassign-dialog/reassign-dialog.component';

import { UserSessionService } from 'src/app/_shared/services/state/user-session.service';
import { PermissionService } from 'src/app/_shared/services/http/permission.service';
import { SelectService } from 'src/app/_shared/services/http/select.service';
import { NotificationService } from 'src/app/_shared/services/generic/notification.service';

import { TranslatePipe } from 'src/app/_shared/pipes/translate/translate.pipe';

import { PermissionModel } from 'src/app/_shared/models/permission.model';

@Component({
  selector: 'app-permissions',
  templateUrl: './permissions.component.html'
})
export class PermissionsComponent {

  @ViewChild(DataTableComponent, { static: true }) dataTable: DataTableComponent;

  readonly sub = new Subscription();

  readonly columns = [
    { label: 'name', name: 'name' },
    { label: 'description', name: 'description' },
    { label: 'user_count', name: 'userCount' }
  ];

  constructor(public userSession: UserSessionService,
              private permissionService: PermissionService,
              private selectService: SelectService,
              private notificationService: NotificationService,
              private dialog: MatDialog,
              private t: TranslatePipe) {}

  fetchItems(): void {
    this.permissionService.getPermissions(this.dataTable.criteria).then(response => {
      this.dataTable.setItems(response);
    });
  }

  deleteItem(permission: PermissionModel): void {
    if (permission.userCount > 0) {
      this.reassignPermission(permission.id, permission.userCount);
      return;
    }

    this.notificationService.warning().then(confirmation => {
      if (confirmation.value) {
        this.deletePermission(permission.id);
      }
    });
  }

  reassignPermission(permissionId: number, userCount: number): void {
    this.selectService.select('permission').then(permissions => {
      const index = permissions.findIndex(permission => permission.id === permissionId);
      if (index !== -1) {
        permissions.splice(index, 1);
      }

      if (permissions.length === 0) {
        const msg = this.t.transform('create_delete_permission_s');
        this.notificationService.error(msg);
        return;
      }

      const dialog = this.dialog.open(ReassignDialogComponent, {
        data: { permissions, userCount },
        width: '500px'
      });

      this.sub.add(dialog.afterClosed().subscribe(newPermissionId => {
        if (newPermissionId) {
          this.deletePermission(permissionId, newPermissionId);
        }
      }));
    });
  }

  private deletePermission(permissionId: number, newPermissionId?: number): void {
    this.permissionService.deletePermission(permissionId, newPermissionId).then(response => {
      if (response) {
        this.notificationService.success();
        this.fetchItems();
      }
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
