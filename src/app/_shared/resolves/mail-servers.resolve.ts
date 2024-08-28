import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';

import { MailServerService } from 'src/app/_shared/services/http/mail-server.service';

import { MailServerModel } from 'src/app/_shared/models/mail-server.model';

@Injectable()
export class MailServersResolve {

	constructor(private mailServerService: MailServerService) {}

	resolve(snapshot: ActivatedRouteSnapshot) {
		const mailServerId = snapshot.params.id;
		return this.mailServerService.getMailServer(mailServerId).then(response => response as MailServerModel);
	}
}
