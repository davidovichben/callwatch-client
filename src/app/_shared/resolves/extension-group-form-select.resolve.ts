import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';

import { SelectService } from 'src/app/_shared/services/http/select.service';

@Injectable()
export class ExtensionGroupFormSelectResolve implements Resolve<object> {

  constructor(private selectService: SelectService) {}

  resolve(snapshot: ActivatedRouteSnapshot) {
    return this.selectService.groupExtensionForm(+snapshot.parent.parent.params.id).then(response => response);
  }
}
