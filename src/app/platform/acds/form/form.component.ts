import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { AcdService } from 'src/app/_shared/services/http/acd.service';

import { ErrorMessages } from 'src/app/_shared/constants/error-messages';
import { EmailPattern } from 'src/app/_shared/constants/patterns';
import { AcdModel } from 'src/app/_shared/models/acd.model';
import { ExtensionModel } from 'src/app/_shared/models/extension.model';
import { Fade } from 'src/app/_shared/constants/animations';

@Component({
	selector: 'app-form',
	templateUrl: './form.component.html',
  animations: [Fade]
})
export class FormComponent implements OnInit, OnDestroy {

  readonly sub = new Subscription();

	readonly errorMessages = ErrorMessages;
  readonly uniqueControlNames = ['number', 'huntPilot', 'secondaryHuntPilot'];

  formType: 'acd' | 'extension';
  tableUrl: 'acds' | 'extensions';

  selects = {
    acds: [],
    extensions: [],
    types: [],
    units: [],
    callbacks: [],
    switchboards: [],
    routers: []
  };

  activeTab = 'general';

  formGroup: FormGroup;
  model: AcdModel | ExtensionModel;

	isSubmitting = false;

	constructor(private router: Router, private route: ActivatedRoute,
        private fb: FormBuilder, private acdService: AcdService) {}

	ngOnInit(): void {
    this.formType = this.router.url.includes('extension') ? 'extension' : 'acd';
    this.tableUrl = this.formType === 'extension' ? 'extensions' : 'acds';

    this.makeForm();
    this.setFormSubscriptions();

    const routeData = this.route.snapshot.data;
    this.selects = routeData.selects;
    if (routeData.acd) {
      this.model = this.formType === 'acd' ? routeData.acd : routeData.extension;
      this.formGroup.patchValue(routeData.acd);
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
        switchboard: this.fb.control(null, Validators.required),
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
      associated: this.fb.control(null),
      callback: this.fb.group({
        callback: this.fb.control(null),
        router: this.fb.control(null),
        overflowNumber: this.fb.control(null),
        email: this.fb.control(null, Validators.pattern(EmailPattern)),
        dialerCallerID: this.fb.control(null)
      })
    })

    if (this.formType === 'extension') {
      this.addDialNumbers();
    }

    this.uniqueControlNames.forEach(controlName => {
      this.formGroup.get('switchboard.' + controlName).setAsyncValidators(this.checkUniqueness.bind(this, [controlName]))
    })
  }

  private addDialNumbers(): void {
    const group = this.fb.group({
        from: this.fb.control(null, Validators.required),
        to: this.fb.control(null, Validators.required)
      }, {
        validator: (group: FormGroup) => {
          if (group.value.to && group.value.from > group.value.to) {
            return { range: true }
          }

          return null;
        }}
    );

    (this.formGroup.get('general') as FormGroup).addControl('dialNumbers', group);
  }

  private setFormSubscriptions(): void {
    const sub = this.formGroup.get('switchboard.switchboard').valueChanges.subscribe(() => this.switchboardChanged());
    this.sub.add(sub);
  }

  switchboardChanged(): void {
    this.uniqueControlNames.forEach(controlName => {
      this.formGroup.get('switchboard.' + controlName).updateValueAndValidity();
    })
  }

  checkUniqueness(args: object, control: FormControl): Promise<{ exists: boolean }> {
    const switchboardId = this.formGroup.get('switchboard.switchboard').value;
    if (!switchboardId) {
      return Promise.resolve(null);
    }

    if (this.model && this.model[args['type']] === control.value) {
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
		if (this.formGroup.valid && !this.isSubmitting) {
			this.isSubmitting = true;

      const values = {};
      Object.keys(this.formGroup.value).forEach(groupName => {
        Object.assign(values, this.formGroup.value[groupName]);
      })

			if (this.model) {
				this.acdService.updateAcd(this.model.id, values).then(response => this.handleServerResponse(response));
			} else {
				this.acdService.newAcd(values).then(response => this.handleServerResponse(response));
			}
		}
	}

	private handleServerResponse(response: boolean): void {
		if (response) {
			this.router.navigate(['/platform', this.tableUrl]);
		}

		this.isSubmitting = false;
	}

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
