import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

import { PermissionService } from 'src/app/_shared/services/http/permission.service';

import { SelectItemModel } from 'src/app/_shared/models/select-item.model';

@Injectable()
export class PermissionSelectResolve implements Resolve<SelectItemModel[]> {

  constructor(private permissionService: PermissionService) {}

  resolve() {
    return this.permissionService.selectPermissions().then(response => response as SelectItemModel[]);
  }
}
