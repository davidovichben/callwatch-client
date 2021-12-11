import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { RouterService } from 'src/app/_shared/services/http/router.service';

import { RouterFormService } from 'src/app/_shared/services/state/router-form.service';

@Component({
	selector: 'app-form',
	templateUrl: './form.component.html'
})
export class FormComponent implements OnInit {

  readonly tabs = [
    { label: 'general', value: 'general', formGroup: 'general' },
    { label: 'active_hours_message_loading', value: 'activeMessages', formGroup: 'messages.active' },
    { label: 'inactive_hours_message_loading', value: 'inactiveMessages', formGroup: 'messages.inactive' },
    { label: 'active_hours_routing', value: 'activeRouting', formGroup: 'keys.active' },
    { label: 'inactive_hours_routing', value: 'inactiveRouting', formGroup: 'keys.inactive' }
  ];

  activeTab = 'general';

  isSubmitting = false;

  constructor(private router: Router, private route: ActivatedRoute,
              private routerService: RouterService,
              public formService: RouterFormService) {}

	ngOnInit(): void {
		const routeData = this.route.snapshot.data;
    this.formService.schedules = routeData.schedules;
    this.formService.routers = routeData.routers;
    this.formService.keyActivityTypes = routeData.keyActivityTypes;

    if (routeData.router) {
      this.formService.router = routeData.router;
      this.formService.messages = routeData.router.messages;
      this.formService.keys = routeData.router.keys;
    }

    this.formService.makeForm();
	}

	submit(): void {
    const values: any = {};

    this.formService.routerForm.markAllAsTouched();
    if (!this.formService.routerForm.valid) {
      this.toggleInvalidTabs();
    }
    //
    // console.log(values)
		// if (this.routerForm.valid && !this.isSubmitting) {
		// 	this.isSubmitting = true;
    //
    //   const values: any = {};
    //   Object.keys(this.routerForm.value).forEach(groupName => {
    //     Object.assign(values, this.routerForm.getRawValue()[groupName]);
    //   })
    //
		// 	if (this.formService.router) {
		// 		this.routerService.updateRouter(this.formService.router.id, values).then(response => this.handleServerResponse(response));
		// 	} else {
		// 		this.routerService.newRouter(values).then(response => this.handleServerResponse(response));
		// 	}
		// }
	}

  private toggleInvalidTabs(): void {
    const form = this.formService.routerForm;
    this.tabs.forEach(tab => {
      if (form.get(tab.formGroup).invalid) {
        this.activeTab = tab.value;
        return;
      }
    });
  }

	private handleServerResponse(response: boolean): void {
		if (response) {
			// this.router.navigate(['/platform', 'routers']);
		}

		this.isSubmitting = false;
	}
}
