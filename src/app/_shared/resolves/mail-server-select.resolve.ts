import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

import { MailServerService } from '../services/http/mail-server.service';

import { SelectItemModel } from 'src/app/_shared/models/select-item.model';

@Injectable()
export class MailServerSelectResolve implements Resolve<SelectItemModel[]> {

  constructor(private mailServerService: MailServerService) {}

  resolve() {
    return this.mailServerService.selectMailServers().then(response => response as SelectItemModel[]);
  }
}
