import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';

import { UserService } from 'src/app/_shared/services/http/user.service';

import { UserModel } from 'src/app/_shared/models/user.model';

@Injectable()
export class UserResolve implements Resolve<UserModel> {

  constructor(private userService: UserService) {}

  resolve(snapshot: ActivatedRouteSnapshot) {
    return this.userService.getUser(+snapshot.params.id).then(response => response as UserModel);
  }
}
