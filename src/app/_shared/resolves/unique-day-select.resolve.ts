import { Injectable } from '@angular/core';


import { UniqueDayService } from 'src/app/_shared/services/http/unique-day.service';

import { UniqueDayModel } from 'src/app/_shared/models/unique-day.model';

@Injectable()
export class UniqueDaySelectResolve  {

  constructor(private uniqueDayService: UniqueDayService) {}

  resolve() {
    return this.uniqueDayService.selectUniqueDay().then(response => response as UniqueDayModel[]);
  }
}
