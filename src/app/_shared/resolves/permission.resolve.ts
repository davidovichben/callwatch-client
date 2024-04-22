import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';

import { PermissionService } from 'src/app/_shared/services/http/permission.service';

import { PermissionModel } from 'src/app/_shared/models/permission.model';

@Injectable()
export class PermissionResolve  {

  constructor(private permissionService: PermissionService) {}

  resolve(snapshot: ActivatedRouteSnapshot) {
    return this.permissionService.getPermission(+snapshot.params.id).then(response => response as PermissionModel);
  }
}
