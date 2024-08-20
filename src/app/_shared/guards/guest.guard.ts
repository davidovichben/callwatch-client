import { inject } from '@angular/core';
import { Router } from '@angular/router';

import { UserSessionService } from 'src/app/_shared/services/state/user-session.service';

const guestGuard = () => {
  if (inject(UserSessionService).isLoggedIn()) {
    inject(Router).navigate(['/platform']);
    return false;
  }
  
  return true;
}

export default guestGuard;
