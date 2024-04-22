import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';

import { SwitchboardService } from 'src/app/_shared/services/http/switchboard.service';

import { SwitchboardModel } from 'src/app/_shared/models/switchboard.model';

@Injectable()
export class SwitchboardResolve  {

	constructor(private switchboardService: SwitchboardService) {}

	resolve(snapshot: ActivatedRouteSnapshot) {
		const switchboardId = +snapshot.params.id;
		return this.switchboardService.getSwitchboard(switchboardId).then(response => response as SwitchboardModel);
	}
}
