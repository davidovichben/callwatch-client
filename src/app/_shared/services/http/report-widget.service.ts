import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BaseHttpService } from 'src/app/_shared/services/http/base-http.service';
import { UserSessionService } from 'src/app/_shared/services/state/user-session.service';

import { ReportWidgetModel } from 'src/app/_shared/models/report-widget.model';
import { DataTableCriteria } from 'src/app/_shared/components/data-table/classes/data-table-criteria';
import { DataTableResponse } from 'src/app/_shared/components/data-table/classes/data-table-response';

@Injectable()
export class ReportWidgetService extends BaseHttpService {

	readonly endPoint = this.apiUrl + '/reportWidget';

	constructor(private http: HttpClient, userSession: UserSessionService) {
		super(userSession);
	}

	getReportWidgets(): Promise<ReportWidgetModel[]> {
		return this.http.get(this.endPoint, this.getTokenRequest())
			.toPromise()
			.then(response => response as ReportWidgetModel[])
			.catch(() => []);
	}

	getReportWidget(reportWidgetId: number): Promise<ReportWidgetModel> {
		return this.http.get(this.endPoint + '/' + reportWidgetId, this.getTokenRequest())
			.toPromise()
			.then(response => response as ReportWidgetModel)
			.catch(() => null);
	}

	newReportWidget(values: object): Promise<any> {
		return this.http.post(this.endPoint, values, this.getTokenRequest())
			.toPromise()
			.then(() => true)
			.catch(() => false);
	}

	updateReportWidget(reportWidgetId: number, values: object): Promise<boolean> {
		return this.http.put(this.endPoint + '/' + reportWidgetId, values, this.getTokenRequest())
			.toPromise()
			.then(() => true)
			.catch(() => false);
	}

	deleteReportWidget(reportWidgetId: number): Promise<boolean> {
		return this.http.delete(this.endPoint + '/' + reportWidgetId, this.getTokenRequest())
			.toPromise()
			.then(() => true)
			.catch(() => false);
	}
}
