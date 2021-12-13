import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

import { AcdService } from 'src/app/_shared/services/http/acd.service';

@Injectable()
export class AcdFormSelectResolve implements Resolve<object> {

  constructor(private acdService: AcdService) {}

  resolve() {
    return this.acdService.formSelects().then(response => response);
  }
}
