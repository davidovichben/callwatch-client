import { Component, ViewChild } from '@angular/core';

import { DataTableComponent } from 'src/app/_shared/components/data-table/data-table.component';

import { UserSessionService } from 'src/app/_shared/services/state/user-session.service';
import { PermissionService } from 'src/app/_shared/services/http/permission.service';
import { NotificationService } from 'src/app/_shared/services/generic/notification.service';

@Component({
  selector: 'app-permissions',
  templateUrl: './permissions.component.html'
})
export class PermissionsComponent {

  @ViewChild(DataTableComponent, { static: true }) dataTable: DataTableComponent;

  readonly columns = [
    { label: 'name', name: 'name' }
  ];

  constructor(public userSession: UserSessionService,
              private permissionService: PermissionService,
              private notificationService: NotificationService) {}

  fetchItems(): void {
    this.permissionService.getPermissions(this.dataTable.criteria).then(response => {
      this.dataTable.setItems(response);
    });
  }

  deletePermission(permissionId: number): void {
    this.notificationService.warning().then(confirmation => {
      if (confirmation.value) {
        this.permissionService.deletePermission(permissionId).then(response => {
          if (response) {
            this.notificationService.success();
            this.fetchItems();
          }
        });
      }
    });
  }
}
