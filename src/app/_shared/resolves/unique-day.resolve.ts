import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';

import { UniqueDayService } from 'src/app/_shared/services/http/unique-day.service';

import { UniqueDayModel } from 'src/app/_shared/models/unique-day.model';

@Injectable()
export class UniqueDayResolve  {

	constructor(private uniqueDayService: UniqueDayService) {}

	resolve(snapshot: ActivatedRouteSnapshot) {
		const uniqueDayId = +snapshot.params.id;
		return this.uniqueDayService.getUniqueDay(uniqueDayId).then(response => response as UniqueDayModel);
	}
}
