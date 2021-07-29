import { Component, ViewChild } from '@angular/core';

import { DataTableComponent } from 'src/app/_shared/components/data-table/data-table.component';

import { UserSessionService } from 'src/app/_shared/services/state/user-session.service';
import { PermissionService } from 'src/app/_shared/services/http/permission.service';

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
              private permissionService: PermissionService) {}

  fetchItems(): void {
    this.permissionService.getPermissions(this.dataTable.criteria).then(response => {
      this.dataTable.setItems(response);
    });
  }

  deletePermission(permissionId: number): void {

  }
}
