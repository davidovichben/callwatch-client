import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { UserModel } from 'src/app/_shared/models/user.model';

@Injectable()
export class UserSessionService {

  loginChange: Subject<boolean> = new Subject();
  userUpdated: Subject<boolean> = new Subject();

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

  getUserId(): any {
    const user = this.getUser();
    if (this.getUser()) {
      return user.id;
    }

    return null;
  }

  updateUser(property: string, value: any): void {
    const user = this.getUser();
    user[property] = value;
    this.setUser(user);

    this.userUpdated.next(true);
  }

  getToken(): string {
    if (sessionStorage.getItem('user')) {
      return JSON.parse(sessionStorage.getItem('user')).token;
    }

    return null;
  }

  setPermissions(permissions: any): void {
    const user = this.getUser();
    user.permissions = permissions;

    this.setUser(user);
  }

  setOrganization(organizationName: string): void {
    const user = this.getUser();
    user.organization = organizationName;

    this.setUser(user);
  }

  hasPermission(module: string, action: string): boolean {
    const user = this.getUser();
    if (!user) {
      return false;
    }

    const permissions = user.permissions;
    if (permissions === 'root') {
      return true;
    }

    return permissions[module] && permissions[module][action];
  }

  canModify(module: string): boolean {
    const user = this.getUser();

    const permissions = user.permissions;
    if (permissions === 'root') {
      return true;
    }

    return permissions[module] && (permissions[module]['update'] || permissions[module]['delete']);
  }

  isRootUser(): boolean {
    return this.getUser().permissions === 'root';
  }
}
