import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { SwitchboardService } from 'src/app/_shared/services/http/switchboard.service';

import { ErrorMessages } from 'src/app/_shared/constants/error-messages';
import { SwitchboardTypes } from 'src/app/_shared/models/switchboard.model';
import { NumberPattern } from 'src/app/_shared/constants/patterns';

@Component({
	selector: 'app-form',
	templateUrl: './form.component.html'
})
export class FormComponent implements OnInit {

	readonly errorMessages = ErrorMessages;

  readonly types = SwitchboardTypes;

  managers = ['A', 'B'];

  switchboardId: number;

  switchboardForm: FormGroup;

  activeTab = 'cti';

  isSubmitting = false;

  constructor(private router: Router, private route: ActivatedRoute,
        private fb: FormBuilder, private switchboardService: SwitchboardService) {}

	ngOnInit(): void {
    this.setForm();

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

  private setForm(): void {
    this.switchboardForm = this.fb.group({
      name: this.fb.control(null, Validators.required),
      type: this.fb.control(null, Validators.required),
      netAddress: this.fb.control(null, Validators.required),
      dataManager: this.fb.control(null),
      minimalSeconds: this.fb.control(null, [Validators.required, Validators.pattern(NumberPattern)]),
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
      control.setValidators([Validators.required, Validators.pattern(NumberPattern)]);
      control.enable();
    } else {
      control.clearValidators();
      control.disable();
      control.reset();
    }

    control.updateValueAndValidity();
  }

  toggleInvalidTabs(): void {
    ['cti', 'axl'].forEach(tab => {
      const oppositeTab = tab === 'cti' ? 'axl' : 'cti';

      if (this.activeTab === tab && this.switchboardForm.get(tab).valid && this.switchboardForm.get(oppositeTab).invalid) {
        this.activeTab = oppositeTab;
      }
    });
  }

	submit(): void {
    if (this.switchboardForm.get('type').value === 'CISCO') {
      this.toggleInvalidTabs();
    }

		if (this.switchboardForm.valid && !this.isSubmitting) {
			this.isSubmitting = true;

			if (this.switchboardId) {
				this.switchboardService.updateSwitchboard(this.switchboardId, this.switchboardForm.value).then(response => {
          this.handleServerResponse(response);
        });
			} else {
				this.switchboardService.newSwitchboard(this.switchboardForm.value).then(response => {
          this.handleServerResponse(response);
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
