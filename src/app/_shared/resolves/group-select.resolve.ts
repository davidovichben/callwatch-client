import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

import { GroupService } from 'src/app/_shared/services/http/group.service';

import { SelectItemModel } from 'src/app/_shared/models/select-item.model';

@Injectable()
export class GroupSelectResolve implements Resolve<SelectItemModel[]> {

  constructor(private groupService: GroupService) {}

  resolve() {
    return this.groupService.selectGroups().then(response => response as SelectItemModel[]);
  }
}
