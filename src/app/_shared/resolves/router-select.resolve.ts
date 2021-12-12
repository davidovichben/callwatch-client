import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

import { GenericService } from 'src/app/_shared/services/http/generic.service';

import { SelectItemModel } from 'src/app/_shared/models/select-item.model';

@Injectable()
export class RouterSelectResolve implements Resolve<SelectItemModel[]> {

  constructor(private genericService: GenericService) {}

  resolve() {
    return this.genericService.select('router').then(response => response as SelectItemModel[]);
  }
}
