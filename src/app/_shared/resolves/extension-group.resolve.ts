import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';

import { ExtensionGroupService } from 'src/app/_shared/services/http/extension-group.service';

import { ExtensionGroupModel } from 'src/app/_shared/models/extension-group.model';

@Injectable()
export class ExtensionGroupResolve implements Resolve<ExtensionGroupModel> {

  constructor(private extensionGroupService: ExtensionGroupService) {}

  resolve(snapshot: ActivatedRouteSnapshot) {
    const unitId = snapshot.parent.parent.params.id;
    return this.extensionGroupService.getExtensionGroup(unitId).then(response => response as ExtensionGroupModel);
  }
}
