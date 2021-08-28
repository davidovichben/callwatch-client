import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

import { PermissionEntityService } from 'src/app/_shared/services/http/permission-entity.service';

import { SelectItemModel } from 'src/app/_shared/models/select-item.model';

@Injectable()
export class PermissionEntitySelectResolve implements Resolve<{ groups: SelectItemModel[], users: SelectItemModel[]}> {

  constructor(private permissionEntityService: PermissionEntityService) {}

  resolve() {
    return this.permissionEntityService.getPermissionEntities().then(response => {
      return response as { groups: SelectItemModel[], users: SelectItemModel[]};
    });
  }
}
