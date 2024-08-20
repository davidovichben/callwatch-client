import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

import { DataTableComponent } from 'src/app/_shared/components/data-table/data-table.component';
import { ReassignDialogComponent } from 'src/app/platform/settings/permissions/reassign-dialog/reassign-dialog.component';

import { UserSessionService } from 'src/app/_shared/services/state/user-session.service';
import { PermissionService } from 'src/app/_shared/services/http/permission.service';
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
              private notificationService: NotificationService,
              private dialog: MatDialog,
              private t: TranslatePipe) {}

  async fetchItems(): Promise<void> {
    const response = await this.permissionService.getPermissions(this.dataTable.criteria);
    this.dataTable.setItems(response);
  }

  async deleteItem(permission: PermissionModel): Promise<void> {
    if (permission.userCount > 0) {
      await this.reassignPermission(permission._id, permission.userCount);
      return;
    }

    const confirmation = await this.notificationService.warning();
    if (confirmation.value) {
      await this.deletePermission(permission._id);
    }
  }

  async reassignPermission(permissionId: string, userCount: number): Promise<void> {
    const permissions = await this.permissionService.selectPermissions();
    
    // Filter out the permission that is being deleted
    
    const filteredPermissions = permissions.filter(permission => permission._id !== permissionId);

    if (filteredPermissions.length === 0) {
      const msg = this.t.transform('create_delete_permission_s');
      this.notificationService.error(msg);
      return;
    }

    const dialog = this.dialog.open(ReassignDialogComponent, {
      data: { permissions: filteredPermissions, userCount },
      width: '500px',
      panelClass: 'no-overflow'
    });

    this.sub.add(dialog.afterClosed().subscribe(newPermissionId => {
      if (newPermissionId) {
        this.deletePermission(permissionId, newPermissionId);
      }
    }));
  }

  private async deletePermission(permissionId: string, newPermissionId?: string): Promise<void> {
    const response = await this.permissionService.deletePermission(permissionId, newPermissionId);
    if (response) {
      this.notificationService.success();
      await this.fetchItems();
    }
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
