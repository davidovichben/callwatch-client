import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BaseHttpService } from 'src/app/_shared/services/http/base-http.service';
import { UserSessionService } from 'src/app/_shared/services/state/user-session.service';

import { AcdModel } from 'src/app/_shared/models/acd.model';
import { DataTableCriteria } from 'src/app/_shared/components/data-table/classes/data-table-criteria';
import { DataTableResponse } from 'src/app/_shared/components/data-table/classes/data-table-response';

@Injectable()
export class AcdService extends BaseHttpService {

	readonly endPoint = this.apiUrl + '/acd';

	constructor(private http: HttpClient, userSession: UserSessionService) {
		super(userSession);
	}

	getAcds(criteria: DataTableCriteria): Promise<DataTableResponse> {
		const params = this.getDataTableParams(criteria);

		return this.http.post(this.endPoint + '/search', params, this.getTokenRequest())
			.toPromise()
			.then(response => response as DataTableResponse)
			.catch(() => null);
	}

	getAcd(acdId: number): Promise<AcdModel> {
		return this.http.get(this.endPoint + '/' + acdId, this.getTokenRequest())
			.toPromise()
			.then(response => response as AcdModel)
			.catch(() => null);
	}

	newAcd(values: object): Promise<any> {
		return this.http.post(this.endPoint, values, this.getTokenRequest())
			.toPromise()
			.then(() => true)
			.catch(() => false);
	}

	updateAcd(acdId: number, values: object): Promise<boolean> {
		return this.http.put(this.endPoint + '/' + acdId, values, this.getTokenRequest())
			.toPromise()
			.then(() => true)
			.catch(() => false);
	}

	deleteAcd(acdId: number): Promise<boolean> {
		return this.http.delete(this.endPoint + '/' + acdId, this.getTokenRequest())
			.toPromise()
			.then(() => true)
			.catch(() => false);
	}

  checkExists(switchboard: number, type: string, value: string): Promise<any> {
    return this.http.get(this.endPoint + '/exists', this.getTokenRequest({ switchboard, type, value }, true))
      .toPromise()
      .then(response => response)
      .catch(() => false);
  }
}
