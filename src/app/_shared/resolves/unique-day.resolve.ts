import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';

import { UniqueDayService } from 'src/app/_shared/services/http/unique-day.service';

import { UniqueDayModel } from 'src/app/_shared/models/unique-day.model';

@Injectable()
export class UniqueDayResolve implements Resolve<UniqueDayModel> {

	constructor(private uniquedayService: UniqueDayService) {}

	resolve(snapshot: ActivatedRouteSnapshot) {
		const uniqueDayId = +snapshot.params.id;
		return this.uniquedayService.getUniqueDay(uniqueDayId).then(response => response as UniqueDayModel);
	}
}
