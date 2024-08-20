import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BaseHttpService } from './base-http.service';
import { UserSessionService } from '../state/user-session.service';
import { InsightsModel } from '../../models/insights.model';

@Injectable()
export class InsightsService extends BaseHttpService {
	
	readonly endPoint = this.apiUrl + '/insights';
	
	constructor(private http: HttpClient, userSession: UserSessionService) {
		super(userSession);
	}
	
	async getLatestInsights(): Promise<InsightsModel> {
		try {
			const response = await this.http.get(this.endPoint + '/latest', this.getTokenRequest())
				.toPromise();
			return response as InsightsModel;
		} catch {
			return null;
		}
	}
}
