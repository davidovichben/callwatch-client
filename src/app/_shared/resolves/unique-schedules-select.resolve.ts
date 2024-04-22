import { Injectable } from '@angular/core';


import { SelectService } from 'src/app/_shared/services/http/select.service';

import { SelectItemModel } from 'src/app/_shared/models/select-item.model';

@Injectable()
export class UniqueScheduleSelectResolve  {

  constructor(private selectService: SelectService) {}

  resolve() {
    return this.selectService.select('schedule', { type: 'unique' }).then(response => response as SelectItemModel[]);
  }
}
