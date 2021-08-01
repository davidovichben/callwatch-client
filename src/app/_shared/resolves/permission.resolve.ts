import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';

import { PermissionService } from 'src/app/_shared/services/http/permission.service';

import { PermissionModel } from 'src/app/_shared/models/permission.model';

@Injectable()
export class PermissionResolve implements Resolve<PermissionModel[]> {

  constructor(private permissionService: PermissionService) {}

  resolve() {
    return this.permissionService.selectPermissions().then(response => response as PermissionModel[]);
  }
}
