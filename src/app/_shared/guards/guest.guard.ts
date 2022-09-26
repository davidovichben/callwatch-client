import { Injectable } from '@angular/core';
import { CanLoad, Router } from '@angular/router';

import { UserSessionService } from 'src/app/_shared/services/state/user-session.service';

@Injectable()
export class GuestGuard implements CanLoad {

  constructor(private userSession: UserSessionService, private router: Router) {}

  canLoad(): boolean {
    if (this.userSession.isLoggedIn()) {
      this.router.navigate(['/platform']);
      return false;
    }

    return true;
  }
}
