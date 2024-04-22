import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { UserSessionService } from 'src/app/_shared/services/state/user-session.service';

@Injectable()
export class LoggedInGuard  {

  constructor(private userSession: UserSessionService, private router: Router) {}

  canLoad(): boolean {
    if (!this.userSession.isLoggedIn()) {
      this.router.navigate(['/']);
      return false;
    }

    return true;
  }
}
