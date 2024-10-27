import { Injectable } from '@angular/core';

import { ReportsService } from '../services/http/reports.service';

@Injectable()
export class ReportsResolve {
	constructor(private reportsService: ReportsService) {}
	
	async resolve(): Promise<any> {
		return (await this.reportsService.getTodayResults());
	}
}
