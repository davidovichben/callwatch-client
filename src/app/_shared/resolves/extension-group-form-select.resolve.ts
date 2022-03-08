import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

import { SelectService } from 'src/app/_shared/services/http/select.service';

@Injectable()
export class ExtensionGroupFormSelectResolve implements Resolve<object> {

  constructor(private selectService: SelectService) {}

  resolve() {
    return this.selectService.groupExtensionForm().then(response => response);
  }
}
