import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { AcdService } from 'src/app/_shared/services/http/acd.service';

import { ErrorMessages } from 'src/app/_shared/constants/error-messages';
import { EmailPattern } from 'src/app/_shared/constants/patterns';
import { AcdModel } from 'src/app/_shared/models/acd.model';
import { Fade } from 'src/app/_shared/constants/animations';

@Component({
	selector: 'app-form',
	templateUrl: './form.component.html',
  animations: [Fade]
})
export class FormComponent implements OnInit, OnDestroy {

  readonly sub = new Subscription();

  readonly tabs = [
    { label: 'general', value: 'general' },
    { label: 'switchboard_settings', value: 'switchboard' },
    { label: 'associated_extensions', value: 'extensions' },
    { label: 'callback', value: 'callback' }
  ];

	readonly errorMessages = ErrorMessages;
  readonly uniqueControlNames = ['number', 'huntPilot', 'secondaryHuntPilot'];

  selects = {
    extensions: [],
    types: [],
    units: [],
    callbacks: [],
    routers: []
  };

  activeTab = 'general';

  formGroup: FormGroup;
  acd: AcdModel;

	isSubmitting = false;

	constructor(private router: Router, private route: ActivatedRoute,
              private fb: FormBuilder, private acdService: AcdService) {}

	ngOnInit(): void {
    this.makeForm();

    const routeData = this.route.snapshot.data;
    this.selects = routeData.selects;
    if (routeData.acd) {
      this.acd = routeData.acd;
      this.formGroup.patchValue(this.acd);
    }
	}

  private makeForm(): void {
    this.formGroup = this.fb.group({
      general: this.fb.group({
        name: this.fb.control(null, Validators.required),
        type: this.fb.control(null, Validators.required),
        unit: this.fb.control(null, Validators.required),
        description: this.fb.control(null)
      }),
      switchboard: this.fb.group({
        number: this.fb.control(null, Validators.required),
        huntPilot: this.fb.control(null),
        secondaryHuntPilot: this.fb.control(null),
        queueFullOverflow: this.fb.control(null),
        maxWaitTime: this.fb.control(null),
        noAgentOverflow: this.fb.control(null),
        noAnswerRedirection: this.fb.control(null),
        busyRedirection: this.fb.control(null),
        isBroadcast: this.fb.control(null),
        hasQueue: this.fb.control(null)
      }),
      extensions: this.fb.control(null),
      callback: this.fb.group({
        callback: this.fb.control(null, Validators.required),
        router: this.fb.control(null),
        overflowNumber: this.fb.control(null, Validators.required),
        email: this.fb.control(null, Validators.pattern(EmailPattern)),
        dialerCallerID: this.fb.control(null)
      })
    })

    this.uniqueControlNames.forEach(controlName => {
      this.formGroup.get('switchboard.' + controlName).setAsyncValidators(this.checkUniqueness.bind(this, [controlName]))
    })
  }

  checkUniqueness(args: object, control: FormControl): Promise<{ exists: boolean }> {
    const unitId = this.formGroup.get('general.unit').value;
    if (!unitId) {
      return Promise.resolve(null);
    }

    if (this.acd && this.acd['switchboard'][args[0]] === control.value) {
      return Promise.resolve(null);
    }

    return this.acdService.checkExists(unitId, args[0], control.value).then(response => {
      if (response) {
        return response.exists ? { exists: true } : null;
      }

      return null;
    });
  }

	submit(): void {
    if (!this.formGroup.valid) {
      this.toggleInvalidTabs();
    }

		if (this.formGroup.valid && !this.isSubmitting) {
			this.isSubmitting = true;

      const values = {
        ...this.formGroup.value.general,
        ...this.formGroup.value.switchboard,
        ...this.formGroup.value.callback,
        extensions: this.formGroup.value.extensions
      };

			if (this.acd) {
				this.acdService.updateAcd(this.acd.id, values).then(response => this.handleServerResponse(response));
			} else {
				this.acdService.newAcd(values).then(response => this.handleServerResponse(response));
			}
		}
	}

  private toggleInvalidTabs(): void {
    if (this.formGroup.get(this.activeTab).invalid) {
      return;
    }

    this.tabs.forEach(tab => {
      if (this.formGroup.get(tab.value).invalid) {
        this.activeTab = tab.value;
        return;
      }
    });
  }

	private handleServerResponse(response: boolean): void {
		if (response) {
			this.router.navigate(['/platform', 'acds']);
		} else {
      this.isSubmitting = false;
    }
	}

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
