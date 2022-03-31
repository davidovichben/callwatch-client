import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

import { RouterService } from 'src/app/_shared/services/http/router.service';
import { HelpersService } from 'src/app/_shared/services/generic/helpers.service';
import { RouterFormService } from 'src/app/_shared/services/state/router-form.service';

@Component({
	selector: 'app-form',
	templateUrl: './form.component.html'
})
export class FormComponent implements OnInit, OnDestroy {

  readonly tabs = [
    { label: 'general', url: ['./general'], formGroup: 'general' },
    { label: 'active_hours_message_loading', url: ['./messages', 'active'], formGroup: 'messages.active' },
    { label: 'inactive_hours_message_loading', url: ['./messages' ,'inactive'], formGroup: 'messages.inactive' },
    { label: 'active_hours_routing', url: ['./routing', 'active'], formGroup: 'keys.active' },
    { label: 'inactive_hours_routing', url: ['./routing', 'inactive'], formGroup: 'keys.inactive' }
  ];

  activeTab: string;

  isSubmitting = false;

  constructor(private router: Router, private route: ActivatedRoute,
              private routerService: RouterService, public formService: RouterFormService,
              private helpers: HelpersService) {}

	ngOnInit(): void {
    this.formService.makeForm();

    const routeData = this.route.snapshot.data;
    this.formService.schedules = routeData.selects.schedules;
    this.formService.routers = routeData.selects.routers;
    this.formService.keyActivityTypes = routeData.selects.keyActivityTypes;
    this.formService.languages = routeData.selects.languages;

    if (routeData.router) {
      this.formService.router = routeData.router;
      this.formService.patchForm();
    }
	}

	submit(): void {
    const form = this.formService.routerForm;

    this.formService.routerForm.markAllAsTouched();
    if (!form.valid) {
      this.toggleInvalidTabs();
    }

		if (form.valid && !this.isSubmitting) {
      this.helpers.setPageSpinner(true);
			this.isSubmitting = true;

      const values = {
        ...(form.get('general') as FormGroup).getRawValue(),
        messages: { ...form.value.messages },
        keys: { ...form.value.keys }
      };

			if (this.formService.router) {
				this.routerService.updateRouter(this.formService.router.id, values).then(response => this.handleServerResponse(response));
			} else {
				this.routerService.newRouter(values).then(response => this.handleServerResponse(response));
			}
		}
	}

  private toggleInvalidTabs(): void {
    const form = this.formService.routerForm;
    const activeGroup = this.formService.activeGroup;

    if (form.get(activeGroup).invalid) {
      return;
    }

    this.tabs.forEach(tab => {
      if (form.get(tab.formGroup).invalid) {
        this.router.navigate(tab.url, { relativeTo: this.route });
        return;
      }
    });
  }

	private handleServerResponse(response: boolean): void {
		if (response) {
			this.router.navigate(['/platform', 'settings', 'routers']);
		} else {
      this.helpers.setPageSpinner(false);
      this.isSubmitting = false;
    }
	}

  ngOnDestroy(): void {
    this.formService.reset();
  }
}
