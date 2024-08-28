import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';

import { MailboxService } from 'src/app/_shared/services/http/mailbox.service';

import { MailboxModel } from 'src/app/_shared/models/mailbox.model';

@Injectable()
export class MailboxesResolve {

  constructor(private mailBoxService: MailboxService) {}

  resolve(snapshot: ActivatedRouteSnapshot) {
    const mailboxId = snapshot.params.id;
    return this.mailBoxService.getMailbox(mailboxId).then(response => response as MailboxModel);
  }
}
