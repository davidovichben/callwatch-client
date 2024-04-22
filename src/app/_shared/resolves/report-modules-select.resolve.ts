import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';

import { SelectService } from 'src/app/_shared/services/http/select.service';

import { SelectItemModel } from 'src/app/_shared/models/select-item.model';

@Injectable()
export class ReportModulesSelectResolve  {

  constructor(private selectService: SelectService) {}

  resolve(snapshot: ActivatedRouteSnapshot) {
    return this.selectService.select('reportModule').then(response => response as SelectItemModel[]);
  }
}
