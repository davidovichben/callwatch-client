import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

import { UniqueDayService } from 'src/app/_shared/services/http/unique-day.service';

import { UniqueDayModel } from 'src/app/_shared/models/unique-day.model';

@Injectable()
export class UniqueDaySelectResolve implements Resolve<UniqueDayModel[]> {

  constructor(private uniqueDayService: UniqueDayService) {}

  resolve() {
    return this.uniqueDayService.selectUniqueDay().then(response => response as UniqueDayModel[]);
  }
}
