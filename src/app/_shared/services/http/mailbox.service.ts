import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BaseHttpService } from 'src/app/_shared/services/http/base-http.service';
import { UserSessionService } from 'src/app/_shared/services/state/user-session.service';

import { MailboxModel } from 'src/app/_shared/models/mailbox.model';
import { DataTableCriteria } from 'src/app/_shared/components/data-table/classes/data-table-criteria';
import { DataTableResponse } from 'src/app/_shared/components/data-table/classes/data-table-response';

@Injectable()
export class MailboxService extends BaseHttpService {

	readonly endPoint = this.apiUrl + '/mailboxes';

	constructor(private http: HttpClient, userSession: UserSessionService) {
		super(userSession);
	}

	getMailboxes(criteria: DataTableCriteria): Promise<DataTableResponse> {
		const params = this.getDataTableParams(criteria);

		return this.http.post(this.endPoint + '/search', params, this.getTokenRequest())
			.toPromise()
			.then(response => response as DataTableResponse)
			.catch(() => null);
	}

	getMailbox(mailBoxId: string): Promise<MailboxModel> {
		return this.http.get(this.endPoint + '/' + mailBoxId, this.getTokenRequest())
			.toPromise()
			.then(response => response as MailboxModel)
			.catch(() => null);
	}

	createMailbox(values: object): Promise<any> {
		return this.http.post(this.endPoint, values, this.getTokenRequest())
			.toPromise()
			.then(() => true)
			.catch(() => false);
	}

	async updateMailbox(mailBoxId: string, values: object): Promise<boolean> {
		try {
			await this.http.put(this.endPoint + '/' + mailBoxId, values, this.getTokenRequest())
				.toPromise();
			return true;
		} catch {
			return false;
		}
	}

  multipleUpdate(checkedItems: any[], values: object): Promise<boolean> {
    return this.http.put(this.endPoint + '/multi', { checkedItems, ...values }, this.getTokenRequest())
      .toPromise()
      .then(() => true)
      .catch(() => false);
  }

	deleteMailbox(mailBoxId: string): Promise<boolean> {
		return this.http.delete(this.endPoint + '/' + mailBoxId, this.getTokenRequest())
			.toPromise()
			.then(() => true)
			.catch(() => false);
	}
	//
  // checkDialNumbersUnique(from: number, to: number, switchboard: number): Promise<any> {
  //   const values = { from, to, switchboard };
  //   return this.http.get(this.endPoint + '/dialNumbersExist', this.getTokenRequest(values, true))
  //     .toPromise()
  //     .then(response => response as { exists: boolean })
  //     .catch(() => false);
  // }
}
