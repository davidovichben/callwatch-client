import { Injectable } from '@angular/core';

import { InsightsService } from '../services/http/insights.service';

import { InsightsModel } from '../models/insights.model';

@Injectable()
export class InsightsResolve {
	constructor(private insightsService: InsightsService) {}
	
	async resolve(): Promise<InsightsModel> {
		return (await this.insightsService.getLatestInsights()) as InsightsModel;
	}
}
