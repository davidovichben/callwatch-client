import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

import { UniqueDayService } from 'src/app/_shared/services/http/unique-day.service';

import { SelectItemModel } from 'src/app/_shared/models/select-item.model';

@Injectable()
export class UniqueDaySelectResolve implements Resolve<SelectItemModel[]> {

  constructor(private uniqueDayService: UniqueDayService) {}

  resolve() {
    return this.uniqueDayService.selectUniqueDays().then(response => response as SelectItemModel[]);
  }
}
