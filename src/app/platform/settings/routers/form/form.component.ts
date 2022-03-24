import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { RouterService } from 'src/app/_shared/services/http/router.service';
import { HelpersService } from 'src/app/_shared/services/generic/helpers.service';
import { RouterFormService } from 'src/app/_shared/services/state/router-form.service';

@Component({
	selector: 'app-form',
	templateUrl: './form.component.html'
})
export class FormComponent implements OnInit, OnDestroy {

  readonly tabs = [
    { label: 'general', value: 'general', formGroup: 'general' },
    { label: 'active_hours_message_loading', value: 'activeMessages', formGroup: 'messages.active' },
    { label: 'inactive_hours_message_loading', value: 'inactiveMessages', formGroup: 'messages.inactive' },
    { label: 'active_hours_routing', value: 'activeRouting', formGroup: 'keys.active' },
    { label: 'inactive_hours_routing', value: 'inactiveRouting', formGroup: 'keys.inactive' }
  ];

  activeTab: { label: string, value: string, formGroup: string };

  formGroup: FormGroup;

  isSubmitting = false;

  constructor(private router: Router, private route: ActivatedRoute,
              private routerService: RouterService,
              public formService: RouterFormService,
              private helpers: HelpersService) {}

	ngOnInit(): void {
    this.activeTab = this.tabs[0];

    this.formService.makeForm();

    this.formGroup = this.formService.routerForm;

    const routeData = this.route.snapshot.data;
    this.formService.schedules = routeData.schedules;
    this.formService.routers = routeData.routers;
    this.formService.keyActivityTypes = routeData.keyActivityTypes;
    this.formService.languages = routeData.languages;

    if (routeData.router) {
      this.formService.router = routeData.router;
    }
	}

	submit(): void {
    const form = this.formService.routerForm;

    form.markAllAsTouched();
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
    if (form.get(this.activeTab.formGroup).invalid) {
      return;
    }

    this.tabs.forEach(tab => {
      if (form.get(tab.formGroup).invalid) {
        this.activeTab = tab;
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
