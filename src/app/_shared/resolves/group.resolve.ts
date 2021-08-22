import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';

import { GroupService } from 'src/app/_shared/services/http/group.service';

import { GroupModel } from 'src/app/_shared/models/group.model';

@Injectable()
export class GroupResolve implements Resolve<GroupModel> {

  constructor(private groupService: GroupService) {}

  resolve(snapshot: ActivatedRouteSnapshot) {
    return this.groupService.getGroup(+snapshot.params.id).then(response => response as GroupModel);
  }
}
