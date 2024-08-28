import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BaseHttpService } from 'src/app/_shared/services/http/base-http.service';
import { UserSessionService } from 'src/app/_shared/services/state/user-session.service';

import { MailServerModel } from 'src/app/_shared/models/mail-server.model';
import { DataTableCriteria } from 'src/app/_shared/components/data-table/classes/data-table-criteria';
import { DataTableResponse } from 'src/app/_shared/components/data-table/classes/data-table-response';

@Injectable()
export class MailServerService extends BaseHttpService {

	readonly endPoint = this.apiUrl + '/mailServers';

	constructor(private http: HttpClient, userSession: UserSessionService) {
		super(userSession);
	}

	getMailServers(criteria: DataTableCriteria): Promise<DataTableResponse> {
		const params = this.getDataTableParams(criteria);

		return this.http.post(this.endPoint + '/search', params, this.getTokenRequest())
			.toPromise()
			.then(response => response as DataTableResponse)
			.catch(() => null);
	}

	getMailServer(mailServerId: string): Promise<MailServerModel> {
		return this.http.get(this.endPoint + '/' + mailServerId, this.getTokenRequest())
			.toPromise()
			.then(response => response as MailServerModel)
			.catch(() => null);
	}

	createMailServer(values: string): Promise<any> {
		return this.http.post(this.endPoint, values, this.getTokenRequest())
			.toPromise()
			.then(() => true)
			.catch(() => false);
	}

	updateMailServer(mailServerId: string, values: object): Promise<boolean> {
		return this.http.put(this.endPoint + '/' + mailServerId, values, this.getTokenRequest())
			.toPromise()
			.then(() => true)
			.catch(() => false);
	}

	deleteMailServer(mailServerId: string): Promise<boolean> {
		return this.http.delete(this.endPoint + '/' + mailServerId, this.getTokenRequest())
			.toPromise()
			.then(() => true)
			.catch(() => false);
	}
}
