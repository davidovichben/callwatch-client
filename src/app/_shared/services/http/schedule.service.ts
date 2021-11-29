import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BaseHttpService } from './base-http.service';
import { UserSessionService } from '../state/user-session.service';

import { ScheduleModel } from 'src/app/_shared/models/schedule.model';

import { DataTableResponse } from 'src/app/_shared/components/data-table/classes/data-table-response';
import { DataTableCriteria } from 'src/app/_shared/components/data-table/classes/data-table-criteria';
import { SelectItemModel } from 'src/app/_shared/models/select-item.model';

@Injectable()
export class ScheduleService extends BaseHttpService {

  readonly endPoint = this.apiUrl + '/schedule';

  constructor(private http: HttpClient, userSession: UserSessionService) {
    super(userSession);
  }

  getSchedules(criteria: DataTableCriteria): Promise<DataTableResponse> {
    const params = this.getDataTableParams(criteria);

    return this.http.post(this.endPoint + '/search', params, this.getTokenRequest())
      .toPromise()
      .then(response => response as DataTableResponse)
      .catch(() => null);
  }

  getSchedule(scheduleId: number): Promise<ScheduleModel> {
    return this.http.get(this.endPoint + '/' + scheduleId, this.getTokenRequest())
      .toPromise()
      .then(response => response as ScheduleModel)
      .catch(() => null);
  }

  newSchedule(values: object): Promise<boolean> {
    return this.http.post(this.endPoint, values, this.getTokenRequest())
      .toPromise()
      .then(() => true)
      .catch(() => false);
  }

  updateSchedule(scheduleId: number, values: object): Promise<boolean> {
    return this.http.put(this.endPoint + '/' + scheduleId, values, this.getTokenRequest())
      .toPromise()
      .then(() => true)
      .catch(() => false);
  }

  deleteSchedule(scheduleId: number): Promise<boolean> {
    return this.http.delete(this.endPoint + '/' + scheduleId, this.getTokenRequest())
      .toPromise()
      .then(() => true)
      .catch(() => false);
  }

  selectSchedules(): Promise<SelectItemModel[]> {
    return this.http.get(this.endPoint + '/select', this.getTokenRequest())
      .toPromise()
      .then(response => response as SelectItemModel[])
      .catch(() => []);
  }
}
