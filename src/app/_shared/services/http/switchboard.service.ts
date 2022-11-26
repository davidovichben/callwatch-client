import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BaseHttpService } from 'src/app/_shared/services/http/base-http.service';
import { UserSessionService } from 'src/app/_shared/services/state/user-session.service';

import { SwitchboardModel } from 'src/app/_shared/models/switchboard.model';
import { DataTableCriteria } from 'src/app/_shared/components/data-table/classes/data-table-criteria';
import { DataTableResponse } from 'src/app/_shared/components/data-table/classes/data-table-response';
import { SelectItemModel } from 'src/app/_shared/models/select-item.model';

@Injectable()
export class SwitchboardService extends BaseHttpService {

	readonly endPoint = this.apiUrl + '/switchboard';

	constructor(private http: HttpClient, userSession: UserSessionService) {
		super(userSession);
	}

	getSwitchboards(criteria: DataTableCriteria): Promise<DataTableResponse> {
		const params = this.getDataTableParams(criteria);

		return this.http.post(this.endPoint + '/search', params, this.getTokenRequest())
			.toPromise()
			.then(response => response as DataTableResponse)
			.catch(() => null);
	}

	getSwitchboard(switchboardId: number): Promise<SwitchboardModel> {
		return this.http.get(this.endPoint + '/' + switchboardId, this.getTokenRequest())
			.toPromise()
			.then(response => response as SwitchboardModel)
			.catch(() => null);
	}

	newSwitchboard(values: string): Promise<any> {
		return this.http.post(this.endPoint, values, this.getTokenRequest())
			.toPromise()
			.then(() => true)
			.catch(() => false);
	}

	updateSwitchboard(switchboardId: number, values: object): Promise<boolean> {
		return this.http.put(this.endPoint + '/' + switchboardId, values, this.getTokenRequest())
			.toPromise()
			.then(() => true)
			.catch(() => false);
	}

	deleteSwitchboard(switchboardId: number): Promise<boolean> {
		return this.http.delete(this.endPoint + '/' + switchboardId, this.getTokenRequest())
			.toPromise()
			.then(() => true)
			.catch(() => false);
	}

  getSwitchboardDefaults(): Promise<object> {
    return this.http.get(this.endPoint + '/defaults', this.getTokenRequest())
      .toPromise()
      .then(response => response)
      .catch(() => null);
  }

  getSwitchboardUnits(switchboardId: number): Promise<SelectItemModel[]> {
    return this.http.get(this.endPoint + '/' + switchboardId + '/units', this.getTokenRequest( ))
      .toPromise()
      .then(response => response as SelectItemModel[])
      .catch(() => []);
  }

  getExtensionsAndAcds(switchboardId: number, unitToAssign = null): Promise<{ extensions: SelectItemModel[], acds: SelectItemModel[] }> {
    const params = {};
    if (unitToAssign) {
      params['unitToAssign'] = unitToAssign;
    }

    return this.http.get(this.endPoint + '/' + switchboardId + '/extensionsAcds', this.getTokenRequest(params))
      .toPromise()
      .then(response => response as { extensions: SelectItemModel[], acds: SelectItemModel[]})
      .catch(() => null);
  }
}
