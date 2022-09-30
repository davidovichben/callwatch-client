import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BaseHttpService } from 'src/app/_shared/services/http/base-http.service';
import { UserSessionService } from 'src/app/_shared/services/state/user-session.service';

import { RouterModel } from 'src/app/_shared/models/router.model';
import { DataTableCriteria } from 'src/app/_shared/components/data-table/classes/data-table-criteria';
import { DataTableResponse } from 'src/app/_shared/components/data-table/classes/data-table-response';
import { SelectItemModel } from 'src/app/_shared/models/select-item.model';

@Injectable()
export class RouterService extends BaseHttpService {

	readonly endPoint = this.apiUrl + '/router';

	constructor(private http: HttpClient, userSession: UserSessionService) {
		super(userSession);
	}

	getRouters(criteria: DataTableCriteria): Promise<DataTableResponse> {
		const params = this.getDataTableParams(criteria);

		return this.http.post(this.endPoint + '/search', params, this.getTokenRequest())
			.toPromise()
			.then(response => response as DataTableResponse)
			.catch(() => null);
	}

	getRouter(routerId: number): Promise<RouterModel> {
		return this.http.get(this.endPoint + '/' + routerId, this.getTokenRequest())
			.toPromise()
			.then(response => response as RouterModel)
			.catch(() => null);
	}

	newRouter(values: object): Promise<any> {
		return this.http.post(this.endPoint, values, this.getTokenRequest())
			.toPromise()
			.then(() => true)
			.catch(() => false);
	}

	updateRouter(routerId: number, values: object): Promise<boolean> {
		return this.http.put(this.endPoint + '/' + routerId, values, this.getTokenRequest())
			.toPromise()
			.then(() => true)
			.catch(() => false);
	}

	deleteRouter(routerId: number): Promise<boolean> {
		return this.http.delete(this.endPoint + '/' + routerId, this.getTokenRequest())
			.toPromise()
			.then(() => true)
			.catch(() => false);
	}

  getKeyActivityTypes(): Promise<SelectItemModel[]> {
    return this.http.get(this.endPoint + '/keyActivityTypes', this.getTokenRequest())
      .toPromise()
      .then(response => response as SelectItemModel[])
      .catch(() => []);
  }

  duplicateRouter(routerId: number, name: string): Promise<any> {
    return this.http.post(this.endPoint + '/' + routerId + '/duplicate', { name }, this.getTokenRequest())
      .toPromise()
      .then(() => true)
      .catch(() => false);
  }

  numbersExist(numbers: string[]): Promise<{ exists: boolean }> {
    return this.http.post(this.endPoint + '/numbersExist', { numbers }, this.getTokenRequest())
      .toPromise()
      .then(response => response as { exists: boolean })
      .catch(() => null);
  }
}
