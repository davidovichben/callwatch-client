import { Injectable } from '@angular/core';


import { SelectService } from 'src/app/_shared/services/http/select.service';

import { SelectItemModel } from 'src/app/_shared/models/select-item.model';

@Injectable()
export class UserSelectResolve  {

  constructor(private selectService: SelectService) {}

  resolve() {
    return this.selectService.select('user').then(response => response as SelectItemModel[]);
  }
}
