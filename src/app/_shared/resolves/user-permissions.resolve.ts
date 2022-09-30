import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

import { UserService } from 'src/app/_shared/services/http/user.service';

@Injectable()
export class UserPermissionsResolve implements Resolve<any> {

  constructor(private userService: UserService) {}

  resolve() {
    return this.userService.getPermissions().then(response => response.permissions);
  }
}
