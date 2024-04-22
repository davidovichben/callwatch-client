import { Injectable } from '@angular/core';


import { SelectService } from 'src/app/_shared/services/http/select.service';

@Injectable()
export class RouterFormResolve  {

  constructor(private selectService: SelectService) {}

  resolve() {
    return this.selectService.routerForm().then(response => response as object);
  }
}
