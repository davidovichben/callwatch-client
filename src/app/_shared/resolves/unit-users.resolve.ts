import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';

import { UnitUserService } from 'src/app/_shared/services/http/unit-user.service';

@Injectable()
export class UnitUsersResolve implements Resolve<object> {

  constructor(private userService: UnitUserService) {}

  resolve(snapshot: ActivatedRouteSnapshot) {
    const unitId = snapshot.parent.parent.params.id;
    return this.userService.getUsers(unitId).then(response => response);
  }
}
