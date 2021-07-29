import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

import { UserService } from 'src/app/_shared/services/http/user.service';

import { SelectItemModel } from 'src/app/_shared/models/select-item.model';

@Injectable()
export class UserSelectResolve implements Resolve<SelectItemModel[]> {

  constructor(private userService: UserService) {}

  resolve() {
    return this.userService.selectUsers().then(response => response as SelectItemModel[]);
  }
}
