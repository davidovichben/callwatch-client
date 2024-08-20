import { Injectable } from '@angular/core';


import { SelectItemModel } from 'src/app/_shared/models/select-item.model';
import { PermissionService } from '../services/http/permission.service';

@Injectable()
export class PermissionSelectResolve  {
  constructor(private permissionService: PermissionService) {}

  resolve() {
    return this.permissionService.selectPermissions().then(response => response as SelectItemModel[]);
  }
}
