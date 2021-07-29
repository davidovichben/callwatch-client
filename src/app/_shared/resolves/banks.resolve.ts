import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

import { GenericService } from 'src/app/_shared/services/http/generic.service';

import { SelectItemModel } from 'src/app/_shared/models/select-item.model';

@Injectable()
export class BanksResolve implements Resolve<SelectItemModel[]> {

  constructor(private genericService: GenericService) {}

  resolve() {
    return this.genericService.getBanks().then(response => response as SelectItemModel[]);
  }
}
