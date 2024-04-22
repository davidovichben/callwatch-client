import { Injectable } from '@angular/core';


import { SwitchboardService } from 'src/app/_shared/services/http/switchboard.service';

@Injectable()
export class SwitchboardDefaultsResolve  {

  constructor(private switchboardService: SwitchboardService) {}

  resolve() {
    return this.switchboardService.getSwitchboardDefaults().then(response => response);
  }
}
