import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { AcdService } from 'src/app/_shared/services/http/acd.service';
import { SwitchboardService } from 'src/app/_shared/services/http/switchboard.service';

import { ErrorMessages } from 'src/app/_shared/constants/error-messages';
import { EmailPattern } from 'src/app/_shared/constants/patterns';
import { Fade } from 'src/app/_shared/constants/animations';
import { isInteger } from 'src/app/_shared/validators/integer.validator';

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
    types: [],
    switchboards: [],
    callbacks: [],
    routers: []
  };

  switchboardUnits = [];
  switchboardExtensions = [];

  activeTab = 'general';

  formGroup: FormGroup;
  acd;

  extensionsLoaded = true;

  isLoadingUnits = false;
	isSubmitting = false;

	constructor(private router: Router, private route: ActivatedRoute,
              private fb: FormBuilder, private acdService: AcdService,
              private switchboardService: SwitchboardService) {}

	ngOnInit(): void {
    this.makeForm();

    const routeData = this.route.snapshot.data;
    this.selects = routeData.selects;
    if (routeData.acd) {
      this.extensionsLoaded = false;
      this.isLoadingUnits = true;

      this.acd = routeData.acd;
      this.formGroup.patchValue(this.acd);

      this.formGroup.get('general.switchboard').disable();

      this.switchboardService.getSwitchboardUnits(this.acd.general.switchboard).then(response => {
        this.switchboardUnits = response;
        this.isLoadingUnits = false;
      });

      this.switchboardService.getExtensionsAndAcds(this.acd.general.switchboard).then(response => {
        this.switchboardExtensions = response.extensions;
        this.extensionsLoaded = true;
      });
    }
	}

  private makeForm(): void {
    this.formGroup = this.fb.group({
      general: this.fb.group({
        name: this.fb.control(null, Validators.required),
        type: this.fb.control(null),
        switchboard: this.fb.control(null, Validators.required),
        unit: this.fb.control(null),
        description: this.fb.control(null)
      }),
      switchboard: this.fb.group({
        number: this.fb.control(null, Validators.required),
        huntPilot: this.fb.control(null),
        secondaryHuntPilot: this.fb.control(null),
        queueFullOverflow: this.fb.control({ value: null, disabled: true }),
        maxWaitTime: this.fb.control({ value: null, disabled: true }),
        noAgentOverflow: this.fb.control({ value: null, disabled: true }),
        noAnswerRedirection: this.fb.control({ value: null, disabled: true }),
        busyRedirection: this.fb.control({ value: null, disabled: true }),
        isBroadcast: this.fb.control(null),
        hasQueue: this.fb.control(null)
      }),
      extensions: this.fb.control(null),
      callback: this.fb.group({
        callback: this.fb.control(null),
        router: this.fb.control(null),
        overflowNumber: this.fb.control(null, isInteger),
        email: this.fb.control(null, Validators.pattern(EmailPattern)),
        dialerCallerID: this.fb.control(null)
      })
    })

    this.uniqueControlNames.forEach(controlName => {
      this.formGroup.get('switchboard.' + controlName).setAsyncValidators(this.checkExists.bind(this, [controlName]))
    })
  }

  fetchSwitchboardUnits(switchboardId) {
    this.isLoadingUnits = true;

    this.switchboardService.getSwitchboardUnits(switchboardId).then(response => {
      this.switchboardUnits = response;
      this.isLoadingUnits = false;
    });

    this.switchboardService.getExtensionsAndAcds(switchboardId).then(response => {
      this.formGroup.get('extensions').reset();
      this.switchboardExtensions = response.extensions;
    });
  }

  checkExists(args: object, control: FormControl): Promise<{ exists: boolean }> {
    const switchboardId = this.formGroup.get('general.switchboard').value;
    if (!switchboardId) {
      return Promise.resolve(null);
    }

    if (this.acd && this.acd['switchboard'][args[0]] === control.value) {
      return Promise.resolve(null);
    }

    return this.acdService.checkExists(switchboardId, args[0], control.value).then(response => {
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
        ...this.formGroup.getRawValue().switchboard,
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
			this.router.navigate(['/platform', 'settings', 'acds']);
		} else {
      this.isSubmitting = false;
    }
	}

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
