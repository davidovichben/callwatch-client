import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BaseHttpService } from 'src/app/_shared/services/http/base-http.service';
import { UserSessionService } from 'src/app/_shared/services/state/user-session.service';

import { MailServerModel } from 'src/app/_shared/models/mail-server.model';
import { DataTableCriteria } from 'src/app/_shared/components/data-table/classes/data-table-criteria';
import { DataTableResponse } from 'src/app/_shared/components/data-table/classes/data-table-response';
import { SelectItemModel } from '../../models/select-item.model';

@Injectable()
export class MailServerService extends BaseHttpService {

	readonly endPoint = this.apiUrl + '/mailServers';

	constructor(http: HttpClient, userSession: UserSessionService) {
		super(userSession, http);
	}

	getMailServers(criteria: DataTableCriteria): Promise<DataTableResponse> {
		const params = this.getDataTableParams(criteria);
		return this.post<DataTableResponse>(`${this.endPoint}/search`, {
			body: params,
			fallback: null
		});
	}

	getMailServer(mailServerId: string): Promise<MailServerModel> {
		return this.get<MailServerModel>(`${this.endPoint}/${mailServerId}`);
	}

	createMailServer(values: string): Promise<boolean> {
		return this.post<boolean>(this.endPoint, {
			body: values
		});
	}
	
	updateMailServer(mailServerId: string, values: object): Promise<boolean> {
		return this.put<boolean>(`${this.endPoint}/${mailServerId}`, {
			body: values
		});
	}
	
	deleteMailServer(mailServerId: string): Promise<boolean> {
		return this.delete<boolean>(`${this.endPoint}/${mailServerId}`);
	}
	
	selectMailServers(): Promise<SelectItemModel[]> {
		return this.get<SelectItemModel[]>(`${this.endPoint}/select`, {
			fallback: []
		});
	}
}
