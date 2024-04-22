import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';

import { CallbackService } from 'src/app/_shared/services/http/callback.service';

import { CallbackModel } from 'src/app/_shared/models/callback.model';

@Injectable()
export class CallbackResolve  {

	constructor(private callbackService: CallbackService) {}

	resolve(snapshot: ActivatedRouteSnapshot) {
		const callbackId = +snapshot.params.id;
		return this.callbackService.getCallback(callbackId).then(response => response as CallbackModel);
	}
}
