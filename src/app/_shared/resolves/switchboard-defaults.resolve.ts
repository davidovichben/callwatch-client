import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

import { SwitchboardService } from 'src/app/_shared/services/http/switchboard.service';

@Injectable()
export class SwitchboardDefaultsResolve implements Resolve<object> {

  constructor(private switchboardService: SwitchboardService) {}

  resolve() {
    return this.switchboardService.getSwitchboardDefaults().then(response => response);
  }
}
