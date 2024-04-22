import { Injectable } from '@angular/core';


import { SelectService } from 'src/app/_shared/services/http/select.service';

@Injectable()
export class AcdFormSelectResolve  {

  constructor(private selectService: SelectService) {}

  resolve() {
    return this.selectService.acdForm().then(response => response);
  }
}
