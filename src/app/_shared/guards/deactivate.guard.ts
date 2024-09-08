import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { NotificationService } from 'src/app/_shared/services/generic/notification.service';

export interface CanComponentDeactivate {
  canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}

@Injectable()
export class DeactivateGuard  {

  constructor(private notificationService: NotificationService) {}

  canDeactivate(component: any) {
    const formSubmitted = component.form ? component.form.submitted : component.isSubmitting;
    if (formSubmitted || (!component.formGroup || !component.formGroup.touched) && (!component.form || !component.form.touched)) {
      return true;
    }
    //
    // return this.notificationService.deactivateWarning();
    
    return true;
  }
}
