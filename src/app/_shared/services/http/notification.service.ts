import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BaseHttpService } from 'src/app/_shared/services/http/base-http.service';
import { UserSessionService } from 'src/app/_shared/services/state/user-session.service';

import { NotificationModel } from 'src/app/_shared/models/notification.model';
import { DataTableCriteria } from 'src/app/_shared/components/data-table/classes/data-table-criteria';
import { DataTableResponse } from 'src/app/_shared/components/data-table/classes/data-table-response';

@Injectable()
export class NotificationService extends BaseHttpService {

	readonly endPoint = `${this.apiUrl}/notifications`;

	constructor(http: HttpClient, userSession: UserSessionService) {
		super(userSession, http);
	}
	
	getNotifications(criteria: DataTableCriteria): Promise<DataTableResponse> {
		const params = this.getDataTableParams(criteria);
		return this.post<DataTableResponse>(`${this.endPoint}/search`, {
			body: params
		});
	}
	
	getNotification(notificationId: string): Promise<NotificationModel> {
		return this.get<NotificationModel>(`${this.endPoint}/${notificationId}`);
	}
}
