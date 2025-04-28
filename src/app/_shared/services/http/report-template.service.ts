import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BaseHttpService } from './base-http.service';
import { UserSessionService } from '../state/user-session.service';

import { DataTableCriteria } from 'src/app/_shared/components/data-table/classes/data-table-criteria';
import { DataTableResponse } from 'src/app/_shared/components/data-table/classes/data-table-response';
import { ReportTemplateModel } from 'src/app/_shared/models/report-template.model';

@Injectable()
export class ReportTemplateService extends BaseHttpService {
	
	readonly endPoint = `${this.apiUrl}/reportTemplate`;
	
	constructor(http: HttpClient, userSession: UserSessionService) {
		super(userSession, http);
	}
	
	getReports(criteria: DataTableCriteria): Promise<DataTableResponse> {
		const params = this.getDataTableParams(criteria);
		return this.post<DataTableResponse>(`${this.endPoint}/search`, {
			body: params
		});
	}
	
	getReport(reportId: number): Promise<ReportTemplateModel> {
		return this.get<ReportTemplateModel>(`${this.endPoint}/${reportId}`);
	}
	
	newReport(values: object): Promise<boolean> {
		return this.post<boolean>(this.endPoint, {
			body: values,
			fallback: false
		});
	}
	
	updateReport(reportId: number, values: object): Promise<boolean> {
		return this.put<boolean>(`${this.endPoint}/${reportId}`, {
			body: values,
			fallback: false
		});
	}
	
	deleteReport(reportId: number): Promise<boolean> {
		return this.delete<boolean>(`${this.endPoint}/${reportId}`, {
			fallback: false
		});
	}
	
	selectReports(): Promise<ReportTemplateModel[]> {
		return this.get<ReportTemplateModel[]>(`${this.endPoint}/select`, {
			fallback: []
		});
	}
	
	getReportTemplatesByModule(module: string): Promise<ReportTemplateModel[]> {
		return this.get<ReportTemplateModel[]>(`${this.endPoint}/byModule`, {
			params: { module },
			fallback: []
		});
	}
	
	produceReport(reportTemplateId: number, criteria: object, page?: number): Promise<any> {
		const params = { page: page ?? 1 };
		
		return this.post<any>(`${this.endPoint}/${reportTemplateId}/produce`, {
			body: criteria,
			params
		});
	}
	
	exportReport(reportTemplateId: number, criteria: object, format: string): Promise<any> {
		return this.getBlob(`${this.endPoint}/${reportTemplateId}/export`, {
			format
		});
	}
}
