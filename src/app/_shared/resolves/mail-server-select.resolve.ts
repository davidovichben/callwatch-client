import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

import { SelectService } from 'src/app/_shared/services/http/select.service';

import { SelectItemModel } from 'src/app/_shared/models/select-item.model';

@Injectable()
export class MailServerSelectResolve implements Resolve<SelectItemModel[]> {

  constructor(private selectService: SelectService) {}

  resolve() {
    return this.selectService.select('switchboard').then(response => response as SelectItemModel[]);
  }
}
