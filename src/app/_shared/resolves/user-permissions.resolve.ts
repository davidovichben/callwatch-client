import { Injectable } from '@angular/core';


import { UserService } from 'src/app/_shared/services/http/user.service';

@Injectable()
export class UserPermissionsResolve  {

  constructor(private userService: UserService) {}

  resolve() {
    return this.userService.getPermissions().then(response => response.permissions);
  }
}
