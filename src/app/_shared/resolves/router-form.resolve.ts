import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

import { SelectService } from 'src/app/_shared/services/http/select.service';

@Injectable()
export class RouterFormResolve implements Resolve<object> {

  constructor(private selectService: SelectService) {}

  resolve() {
    return this.selectService.routerForm().then(response => response as object);
  }
}
