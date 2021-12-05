import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BaseHttpService } from 'src/app/_shared/services/http/base-http.service';
import { UserSessionService } from 'src/app/_shared/services/state/user-session.service';

import { UniqueDayModel } from 'src/app/_shared/models/unique-day.model';
import { DataTableCriteria } from 'src/app/_shared/components/data-table/classes/data-table-criteria';
import { DataTableResponse } from 'src/app/_shared/components/data-table/classes/data-table-response';

@Injectable()
export class UniqueDayService extends BaseHttpService {

	readonly endPoint = this.apiUrl + '/uniqueDay';

	constructor(private http: HttpClient, userSession: UserSessionService) {
		super(userSession);
	}

	getUniqueDays(criteria: DataTableCriteria): Promise<DataTableResponse> {
		const params = this.getDataTableParams(criteria);

		return this.http.post(this.endPoint + '/search', params, this.getTokenRequest())
			.toPromise()
			.then(response => response as DataTableResponse)
			.catch(() => null);
	}

	getUniqueDay(uniqueDayId: number): Promise<UniqueDayModel> {
		return this.http.get(this.endPoint + '/' + uniqueDayId, this.getTokenRequest())
			.toPromise()
			.then(response => response as UniqueDayModel)
			.catch(() => null);
	}

	newUniqueDay(values: string): Promise<any> {
		return this.http.post(this.endPoint, values, this.getTokenRequest())
			.toPromise()
			.then(() => true)
			.catch(() => false);
	}

	updateUniqueDay(uniqueDayId: number, values: object): Promise<boolean> {
		return this.http.put(this.endPoint + '/' + uniqueDayId, values, this.getTokenRequest())
			.toPromise()
			.then(() => true)
			.catch(() => false);
	}
}
