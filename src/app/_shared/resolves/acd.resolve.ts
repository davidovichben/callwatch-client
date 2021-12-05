import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';

import { AcdService } from 'src/app/_shared/services/http/acd.service';

import { AcdModel } from 'src/app/_shared/models/acd.model';

@Injectable()
export class AcdResolve implements Resolve<AcdModel> {

	constructor(private acdService: AcdService) {}

	resolve(snapshot: ActivatedRouteSnapshot) {
		const acdId = +snapshot.params.id;
		return this.acdService.getAcd(acdId).then(response => response as AcdModel);
	}
}
