import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { UserModel } from 'src/app/_shared/models/user.model';
import { jwtDecode } from 'jwt-decode';

@Injectable()
export class UserSessionService {

  loginChange: Subject<boolean> = new Subject();
  userUpdated: Subject<boolean> = new Subject();

  isLoggedIn(): boolean {
    return !!sessionStorage.getItem('user');
  }

  setUser(token: string): void {
    sessionStorage.setItem('token', token)
    sessionStorage.setItem('user', JSON.stringify(jwtDecode(token)));
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

  getUserId(): string {
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
    return sessionStorage.getItem('token');
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
