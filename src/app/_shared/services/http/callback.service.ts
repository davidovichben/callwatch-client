import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BaseHttpService } from 'src/app/_shared/services/http/base-http.service';
import { UserSessionService } from 'src/app/_shared/services/state/user-session.service';

import { CallbackModel } from 'src/app/_shared/models/callback.model';
import { DataTableCriteria } from 'src/app/_shared/components/data-table/classes/data-table-criteria';
import { DataTableResponse } from 'src/app/_shared/components/data-table/classes/data-table-response';

@Injectable()
export class CallbackService extends BaseHttpService {

	readonly endPoint = this.apiUrl + '/callback';

	constructor(private http: HttpClient, userSession: UserSessionService) {
		super(userSession);
	}

	getCallbacks(criteria: DataTableCriteria): Promise<DataTableResponse> {
		const params = this.getDataTableParams(criteria);

		return this.http.post(this.endPoint + '/search', params, this.getTokenRequest())
			.toPromise()
			.then(response => response as DataTableResponse)
			.catch(() => null);
	}

	getCallback(callbackId: number): Promise<CallbackModel> {
		return this.http.get(this.endPoint + '/' + callbackId, this.getTokenRequest())
			.toPromise()
			.then(response => response as CallbackModel)
			.catch(() => null);
	}

	newCallback(values: string): Promise<any> {
		return this.http.post(this.endPoint, values, this.getTokenRequest())
			.toPromise()
			.then(() => true)
			.catch(() => false);
	}

	updateCallback(callbackId: number, values: object): Promise<boolean> {
		return this.http.put(this.endPoint + '/' + callbackId, values, this.getTokenRequest())
			.toPromise()
			.then(() => true)
			.catch(() => false);
	}

  multipleUpdate(checkedItems: any[], values: object): Promise<boolean> {
    return this.http.put(this.endPoint + '/multipleUpdate', { checkedItems, ...values }, this.getTokenRequest())
      .toPromise()
      .then(() => true)
      .catch(() => false);
  }

	deleteCallback(callbackId: number): Promise<boolean> {
		return this.http.delete(this.endPoint + '/' + callbackId, this.getTokenRequest())
			.toPromise()
			.then(() => true)
			.catch(() => false);
	}
}
