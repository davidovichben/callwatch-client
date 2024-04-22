import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';

import { ScheduleService } from 'src/app/_shared/services/http/schedule.service';

import { ScheduleModel } from 'src/app/_shared/models/schedule.model';

@Injectable()
export class ScheduleResolve  {

  constructor(private scheduleService: ScheduleService) {}

  resolve(snapshot: ActivatedRouteSnapshot) {
    const scheduleId = +snapshot.params.id;
    return this.scheduleService.getSchedule(scheduleId).then(response => response as ScheduleModel);
  }
}
