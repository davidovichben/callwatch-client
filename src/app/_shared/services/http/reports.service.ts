import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BaseHttpService } from './base-http.service';
import { UserSessionService } from '../state/user-session.service';

import {
	RealtimeReportInterval,
	ReportCriteriaModel
} from '../../models/report-criteria.model';
import { ReportRealtimeResultsModel } from '../../models/report-realtime-results.model';
import { ReportResultsModel } from '../../models/report-results.model';

@Injectable()
export class ReportsService extends BaseHttpService {
	
	readonly endPoint = this.apiUrl + '/reports';
	
	constructor(private http: HttpClient, userSession: UserSessionService) {
		super(userSession);
	}
	
	async getRealtimeResults(interval?: RealtimeReportInterval): Promise<any> {
		if (!interval) {
			interval = RealtimeReportInterval.day;
		}
		
		try {
			const results = await this.http.post(this.endPoint + '/realtime', { interval }, this.getTokenRequest())
				.toPromise();
			
			if (!Object.keys(results).length) {
				return new ReportRealtimeResultsModel();
			}

			return results;
		} catch {
			return new ReportRealtimeResultsModel();
		}
	}
	
	async getHistoricalResults(criteria: ReportCriteriaModel): Promise<ReportResultsModel> {
		try {
			return await this.http.post(this.endPoint + '/historical', criteria, this.getTokenRequest()).toPromise() as ReportResultsModel;
		} catch {
			return new ReportResultsModel();
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
