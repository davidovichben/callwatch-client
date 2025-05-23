import { Injectable } from '@angular/core';


import { SelectService } from 'src/app/_shared/services/http/select.service';

import { SelectItemModel } from 'src/app/_shared/models/select-item.model';

@Injectable()
export class LanguageSelectResolve  {

  constructor(private selectService: SelectService) {}

  resolve() {
    return this.selectService.select('language').then(response => response as SelectItemModel[]);
  }
}
