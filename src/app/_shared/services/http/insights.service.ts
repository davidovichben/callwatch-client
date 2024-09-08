import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BaseHttpService } from './base-http.service';
import { UserSessionService } from '../state/user-session.service';
import { InsightsModel } from '../../models/insights.model';
import { ReportCriteriaModel } from '../../models/report-criteria.model';

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
	
	async getHistoricalInsights(criteria: ReportCriteriaModel): Promise<any[]> {
		try {
			const response = await this.http.post(this.endPoint + '/historical', criteria, this.getTokenRequest())
				.toPromise();
			return response as any[];
		} catch {
			return [];
		}
	}
}
