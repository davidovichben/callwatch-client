import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';

import { NotificationService } from 'src/app/_shared/services/generic/notification.service';

export interface CanComponentDeactivate {
  canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}

@Injectable()
export class DeactivateGuard implements CanDeactivate<CanComponentDeactivate> {

  constructor(private notificationService: NotificationService) {}

  canDeactivate(component) {
    if (component.isSubmitting || !component.formGroup || !component.formGroup.dirty) {
      return true;
    }

    return this.notificationService.deactivateWarning();
  }
}
