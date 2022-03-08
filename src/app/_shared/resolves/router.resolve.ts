import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';

import { RouterService } from 'src/app/_shared/services/http/router.service';

import { RouterModel } from 'src/app/_shared/models/router.model';

@Injectable()
export class RouterResolve implements Resolve<RouterModel> {

	constructor(private routerService: RouterService) {}

	resolve(snapshot: ActivatedRouteSnapshot) {
		const routerId = +snapshot.params.id;
		return this.routerService.getRouter(routerId).then(response => response as RouterModel);
	}
}
