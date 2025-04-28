import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BaseHttpService } from 'src/app/_shared/services/http/base-http.service';
import { UserSessionService } from 'src/app/_shared/services/state/user-session.service';

import { MailboxModel } from 'src/app/_shared/models/mailbox.model';
import { DataTableCriteria } from 'src/app/_shared/components/data-table/classes/data-table-criteria';
import { DataTableResponse } from 'src/app/_shared/components/data-table/classes/data-table-response';

@Injectable()
export class MailboxService extends BaseHttpService {

	readonly endPoint = `${this.apiUrl}/mailboxes`;

	constructor(http: HttpClient, userSession: UserSessionService) {
		super(userSession, http);
	}

	getMailboxes(criteria: DataTableCriteria): Promise<DataTableResponse> {
		const params = this.getDataTableParams(criteria);
		return this.post<DataTableResponse>(`${this.endPoint}/search`, {
			body: params
		});
	}
	
	getMailbox(mailBoxId: string): Promise<MailboxModel> {
		return this.get<MailboxModel>(`${this.endPoint}/${mailBoxId}`);
	}
	
	createMailbox(values: object): Promise<boolean> {
		return this.post<boolean>(this.endPoint, {
			body: values
		});
	}
	
	updateMailbox(mailBoxId: string, values: object): Promise<boolean> {
		return this.put<boolean>(`${this.endPoint}/${mailBoxId}`, {
			body: values
		});
	}
	
	multipleUpdate(checkedItems: any[], values: object): Promise<boolean> {
		return this.put<boolean>(`${this.endPoint}/multi`, {
			body: { checkedItems, ...values }
		});
	}
	
	deleteMailbox(mailBoxId: string): Promise<boolean> {
		return this.delete<boolean>(`${this.endPoint}/${mailBoxId}`);
	}
}
