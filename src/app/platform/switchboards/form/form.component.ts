import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { SwitchboardService } from 'src/app/_shared/services/http/switchboard.service';

import { ErrorMessages } from 'src/app/_shared/constants/error-messages';
import { SwitchboardTypes } from 'src/app/_shared/models/switchboard.model';

@Component({
	selector: 'app-form',
	templateUrl: './form.component.html'
})
export class FormComponent implements OnInit {

	readonly errorMessages = ErrorMessages;

  readonly types = SwitchboardTypes;

  managers = ['A', 'B'];

  switchboardId: number;

	isSubmitting = false;

  switchboardForm: FormGroup;

  activeTab = 'cti';

	constructor(private router: Router, private route: ActivatedRoute,
        private fb: FormBuilder, private switchboardService: SwitchboardService) {}

	ngOnInit(): void {
    this.switchboardForm = this.fb.group({
      name: this.fb.control(null, Validators.required),
      type: this.fb.control(null, Validators.required),
      netAddress: this.fb.control(null, Validators.required),
      dataManager: this.fb.control(null),
      minimalSeconds: this.fb.control(null, Validators.required),
      cti: this.fb.group({
        username: this.fb.control(null, Validators.required),
        password: this.fb.control(null, Validators.required),
        dailyUpdateAt: this.fb.control(null, Validators.required),
        number: this.fb.control({ value: null, disabled: true })
      }),
      axl: this.fb.group({
        address: this.fb.control(null),
        username: this.fb.control(null),
        password: this.fb.control(null),
        number: this.fb.control({ value: null, disabled: true })
      })
    });

    const routeData = this.route.snapshot.data;
    if (routeData.switchboard) {
      this.switchboardId = routeData.switchboard.id;
      this.switchboardForm.patchValue(routeData.switchboard);

      ['cti', 'axl'].forEach(service => {
        const number = this.switchboardForm.get(service + '.number').value;
        if (number) {
          this.toggleServiceNumber(true, service);
        }
      });
    }
  }

  toggleAxi(value: string): void {
    const validators = value === 'CISCO' ? [Validators.required] : [];
    ['address', 'username', 'password'].forEach(control => {
      this.switchboardForm.get('axl.' + control).setValidators(validators);
      this.switchboardForm.get('axl.' + control).updateValueAndValidity();
    });

    if (value !== 'CISCO') {
      this.switchboardForm.get('axl').reset();
      this.activeTab = 'cti';
    }
  }

  toggleServiceNumber(isChecked: boolean, service: string): void {
    const control = this.switchboardForm.get(service + '.number');
    if (isChecked) {
      control.setValidators(Validators.required);
      control.enable();
    } else {
      control.clearValidators();
      control.disable();
      control.reset();
    }

    control.updateValueAndValidity();
  }

	submit(): void {
		if (this.switchboardForm.valid) {
			this.isSubmitting = true;

			if (this.switchboardId) {
				this.switchboardService.updateSwitchboard(this.switchboardId, this.switchboardForm.value).then(response => {
          this.handleServerResponse(response)
        });
			} else {
				this.switchboardService.newSwitchboard(this.switchboardForm.value).then(response => {
          this.handleServerResponse(response)
        });
			}
		}
	}

	private handleServerResponse(response: boolean): void {
		if (response) {
			this.router.navigate(['/platform', 'switchboards']);
		}

		this.isSubmitting = false;
	}
}
