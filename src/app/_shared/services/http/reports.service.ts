import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BaseHttpService } from './base-http.service';
import { UserSessionService } from '../state/user-session.service';

import { ReportCriteriaModel } from '../../models/report-criteria.model';

@Injectable()
export class ReportsService extends BaseHttpService {
	
	readonly endPoint = this.apiUrl + '/reports';
	
	constructor(private http: HttpClient, userSession: UserSessionService) {
		super(userSession);
	}
	
	async getTodayResults(): Promise<any> {
		try {
			return await this.http.get(this.endPoint + '/today', this.getTokenRequest())
				.toPromise();
		} catch {
			return null;
		}
	}
	
	async getHistoricalResults(criteria: ReportCriteriaModel): Promise<{ headers: string[], rows: string[], columns: {}}> {
		try {
			return await this.http.post(this.endPoint + '/historical', criteria, this.getTokenRequest()).toPromise() as {
				headers: string[], rows: string[], columns: {}
			};
		} catch {
			return { headers: [], rows: [], columns: {} };
		}
	}
	
	async exportReport(criteria: ReportCriteriaModel): Promise<any> {
		try {
			return await this.http.post(this.endPoint + '/export', criteria, this.getBlobRequest()).toPromise();
		} catch {
			return null;
		}
	}
	
	async getColumns(): Promise<any> {
		try {
			return await this.http.get(this.endPoint + '/columns', this.getTokenRequest()).toPromise();
		} catch {
			return [];
		}
	}
}
