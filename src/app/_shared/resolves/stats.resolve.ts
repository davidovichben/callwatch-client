import { Injectable } from '@angular/core';

import { StatsService } from '../services/http/stats.service';

import { StatsModel } from '../models/stats.model';

@Injectable()
export class StatsResolve  {
	constructor(private statsService: StatsService) {}
	
	async resolve(): Promise<StatsModel> {
		return (await this.statsService.getStats()) as StatsModel;
	}
}
