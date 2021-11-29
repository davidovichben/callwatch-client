import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

import { ScheduleService } from 'src/app/_shared/services/http/schedule.service';

import { SelectItemModel } from 'src/app/_shared/models/select-item.model';

@Injectable()
export class ScheduleSelectResolve implements Resolve<SelectItemModel[]> {

  constructor(private scheduleService: ScheduleService) {}

  resolve() {
    return this.scheduleService.selectSchedules().then(response => response as SelectItemModel[]);
  }
}
