import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BaseHttpService } from './base-http.service';
import { UserSessionService } from '../state/user-session.service';
import { StatsModel } from '../../models/stats.model';

@Injectable()
export class StatsService extends BaseHttpService {
	
	readonly endPoint = 'http://localhost:3000';//this.apiUrl + '/stats';
	
	constructor(private http: HttpClient, userSession: UserSessionService) {
		super(userSession);
	}
	
	getStats(): Promise<StatsModel> {
		return this.http.get(this.endPoint, this.getTokenRequest())
			.toPromise()
			.then(response => response as StatsModel)
			.catch(() => null);
	}
}
