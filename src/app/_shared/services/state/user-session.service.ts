import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { UserModel } from 'src/app/_shared/models/user.model';

@Injectable()
export class UserSessionService {

  loginChange: Subject<boolean> = new Subject();

  isLoggedIn(): boolean {
    return !!sessionStorage.getItem('user');
  }

  setUser(user: UserModel): void {
    sessionStorage.setItem('user', JSON.stringify(user));
    this.loginChange.next(true);
  }

  unsetUser(): void {
    sessionStorage.removeItem('user');
    this.loginChange.next(false);
  }

  getUser(): any {
    if (sessionStorage.getItem('user')) {
      return JSON.parse(sessionStorage.getItem('user'));
    }

    return null;
  }

  getToken(): string {
    if (sessionStorage.getItem('user')) {
      return JSON.parse(sessionStorage.getItem('user')).token;
    }

    return null;
  }

  hasPermission(unitId: number, module: string, action: string): boolean {
    const user = this.getUser();

    const permissions = user.permissions;
    if (permissions === 'root' || user.isAdmin) {
      return true;
    }

    const unitPermissions = permissions[unitId];

    return unitPermissions && unitPermissions[module] && unitPermissions[module][action];
  }
}
