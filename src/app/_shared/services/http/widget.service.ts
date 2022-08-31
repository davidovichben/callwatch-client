import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BaseHttpService } from 'src/app/_shared/services/http/base-http.service';
import { UserSessionService } from 'src/app/_shared/services/state/user-session.service';

import { WidgetModel } from 'src/app/_shared/models/widget.model';

@Injectable({
  providedIn: 'root'
})
export class WidgetService extends BaseHttpService {

  readonly endPoint = this.apiUrl + '/widget';

  constructor(private http: HttpClient, userSession: UserSessionService) {
    super(userSession);
  }

  getWidgets(): Promise<WidgetModel[]> {
    return this.http.get(this.endPoint, this.getTokenRequest())
      .toPromise()
      .then(response => response as WidgetModel[])
      .catch(() => null);
  }

  getWidget(widgetId: number): Promise<WidgetModel> {
    return this.http.get(this.endPoint + '/' + widgetId, this.getTokenRequest())
      .toPromise()
      .then(response => response as WidgetModel)
      .catch(() => null);
  }

  newWidget(values: object): Promise<any> {
    return this.http.post(this.endPoint, values, this.getTokenRequest())
      .toPromise()
      .then(() => true)
      .catch(() => false);
  }

  updateWidget(widget: WidgetModel): Promise<boolean> {
    return this.http.put(this.endPoint + '/' + widget.id, widget, this.getTokenRequest())
      .toPromise()
      .then(() => true)
      .catch(() => false);
  }

  deleteWidget(widgetId: number): Promise<boolean> {
    return this.http.delete(this.endPoint + '/' + widgetId, this.getTokenRequest())
      .toPromise()
      .then(() => true)
      .catch(() => false);
  }
}
