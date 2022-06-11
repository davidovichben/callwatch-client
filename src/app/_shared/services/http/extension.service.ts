import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BaseHttpService } from 'src/app/_shared/services/http/base-http.service';
import { UserSessionService } from 'src/app/_shared/services/state/user-session.service';

import { ExtensionModel } from 'src/app/_shared/models/extension.model';
import { DataTableCriteria } from 'src/app/_shared/components/data-table/classes/data-table-criteria';
import { DataTableResponse } from 'src/app/_shared/components/data-table/classes/data-table-response';

@Injectable()
export class ExtensionService extends BaseHttpService {

	readonly endPoint = this.apiUrl + '/extension';

	constructor(private http: HttpClient, userSession: UserSessionService) {
		super(userSession);
	}

	getExtensions(criteria: DataTableCriteria): Promise<DataTableResponse> {
		const params = this.getDataTableParams(criteria);

		return this.http.post(this.endPoint + '/search', params, this.getTokenRequest())
			.toPromise()
			.then(response => response as DataTableResponse)
			.catch(() => null);
	}

	getExtension(extensionId: number): Promise<ExtensionModel> {
		return this.http.get(this.endPoint + '/' + extensionId, this.getTokenRequest())
			.toPromise()
			.then(response => response as ExtensionModel)
			.catch(() => null);
	}

	newExtension(values: object): Promise<any> {
		return this.http.post(this.endPoint, values, this.getTokenRequest())
			.toPromise()
			.then(() => true)
			.catch(() => false);
	}

	updateExtension(extensionId: number, values: object): Promise<boolean> {
		return this.http.put(this.endPoint + '/' + extensionId, values, this.getTokenRequest())
			.toPromise()
			.then(() => true)
			.catch(() => false);
	}

	deleteExtension(extensionId: number): Promise<boolean> {
		return this.http.delete(this.endPoint + '/' + extensionId, this.getTokenRequest())
			.toPromise()
			.then(() => true)
			.catch(() => false);
	}

  checkDialNumbersUnique(from: number, to: number, switchboard: number): Promise<any> {
    const values = { from, to, switchboard };
    return this.http.get(this.endPoint + '/dialNumbersExist', this.getTokenRequest(values, true))
      .toPromise()
      .then(response => response as { exists: boolean })
      .catch(() => false);
  }
}
