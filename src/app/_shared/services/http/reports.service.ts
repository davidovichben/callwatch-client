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
	
	readonly endPoint = `${this.apiUrl}/reports`;
	
	constructor(http: HttpClient, userSession: UserSessionService) {
		super(userSession, http);
	}
	
	async getRealtimeResults(interval?: RealtimeReportInterval): Promise<any> {
		if (!interval) {
			interval = RealtimeReportInterval.day;
		}
		
		try {
			const results = await this.post<any>(`${this.endPoint}/realtime`, {
				body: { interval }
			});
			
			if (!results || !Object.keys(results).length) {
				return new ReportRealtimeResultsModel();
			}

			return results;
		} catch {
			return new ReportRealtimeResultsModel();
		}
	}
	
	async getHistoricalResults(criteria: ReportCriteriaModel): Promise<ReportResultsModel> {
		try {
			const result = await this.post<ReportResultsModel>(`${this.endPoint}/historical`, {
				body: criteria,
				fallback: new ReportResultsModel()
			});
			return result || new ReportResultsModel();
		} catch {
			return new ReportResultsModel();
		}
	}
	
	async exportReport(criteria: ReportCriteriaModel): Promise<any> {
		try {
			return await this.getBlob(`${this.endPoint}/export`, criteria);
		} catch {
			return null;
		}
	}
	
	async getColumns(): Promise<any> {
		try {
			return await this.get<any>(`${this.endPoint}/columns`, {
				fallback: []
			});
		} catch {
			return [];
		}
	}
}
