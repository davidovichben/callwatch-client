import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

import { RouterService } from 'src/app/_shared/services/http/router.service';

import { SelectItemModel } from 'src/app/_shared/models/select-item.model';

@Injectable()
export class RouterActivityTypeResolve implements Resolve<SelectItemModel[]> {

  constructor(private routerService: RouterService) {}

  resolve() {
    return this.routerService.getKeyActivityTypes().then(response => response as SelectItemModel[]);
  }
}
