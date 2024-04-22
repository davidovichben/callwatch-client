import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';

import { ExtensionService } from 'src/app/_shared/services/http/extension.service';

import { ExtensionModel } from 'src/app/_shared/models/extension.model';

@Injectable()
export class ExtensionResolve  {

  constructor(private extensionService: ExtensionService) {}

  resolve(snapshot: ActivatedRouteSnapshot) {
    const extensionId = +snapshot.params.id;
    return this.extensionService.getExtension(extensionId).then(response => response as ExtensionModel);
  }
}
