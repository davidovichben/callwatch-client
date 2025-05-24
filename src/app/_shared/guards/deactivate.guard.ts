import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate } from '@angular/router';

import { NotificationService } from 'src/app/_shared/services/generic/notification.service';

@Injectable({
  providedIn: 'root'
})
export class DeactivateGuard implements CanDeactivate<any> {

  constructor(private notificationService: NotificationService) {}

  async canDeactivate(
    component: any,
    currentRoute: ActivatedRouteSnapshot
  ): Promise<boolean> {
    // For standalone components, the component might be in a different location
    // Try to get the component from the router outlet or route context
    if (!component && currentRoute && currentRoute.component) {
      // Try to access component from route contexts
      const routeOutlet = document.querySelector('router-outlet');
      if (routeOutlet) {
        // Get the component instance from the router outlet
        const componentRef = (routeOutlet as any).attachedRef;
        if (componentRef) {
          component = componentRef.instance;
        }
      }
    }
    
    // If component is still null, allow navigation
    if (!component) {
      console.warn('DeactivateGuard: Component instance not found');
      return true;
    }
    
    // Handle components that implement the CanComponentDeactivate interface
    if (component.canDeactivate) {
      return component.canDeactivate();
    }

    // Check if form was submitted or is submitting
    const formSubmitted =
      (component.form && component.form.submitted) ||
      (component.isSubmitting === true);
    
    // Check if form was modified
    const formModified =
      (component.formGroup && component.formGroup.touched) ||
      (component.form && component.form.touched);
    
    // If form was submitted or not modified, allow navigation
    if (formSubmitted || !formModified) {
      return true;
    }
    
    // Ask for confirmation if form was modified but not submitted
    return this.notificationService.deactivateWarning();
  }
}
