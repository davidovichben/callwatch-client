import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { SwitchboardService } from 'src/app/_shared/services/http/switchboard.service';

import { ErrorMessages } from 'src/app/_shared/constants/error-messages';
import { SwitchboardModel, SwitchboardTypes } from 'src/app/_shared/models/switchboard.model';
import { isInteger } from 'src/app/_shared/validators/integer.validator';

@Component({
	selector: 'app-form',
	templateUrl: './form.component.html'
})
export class FormComponent implements OnInit {

	readonly errorMessages = ErrorMessages;

  readonly types = SwitchboardTypes;

  managers = [];

  switchboardId: number;

  formGroup: FormGroup;

  activeTab = 'cti';

  isSubmitting = false;

  constructor(private router: Router, private route: ActivatedRoute,
        private fb: FormBuilder, private switchboardService: SwitchboardService) {}

	ngOnInit(): void {
    this.setForm();

    const routeData = this.route.snapshot.data;
    if (routeData.switchboard) {
      this.patchData(routeData.switchboard);
    }
  }

  private setForm(): void {
    this.formGroup = this.fb.group({
      name: this.fb.control(null, Validators.required),
      type: this.fb.control(null, Validators.required),
      netAddress: this.fb.control(null, Validators.required),
      dataManager: this.fb.control(null),
      minimalSeconds: this.fb.control(null, [Validators.required, isInteger]),
      cti: this.fb.group({
        username: this.fb.control(null, Validators.required),
        password: this.fb.control(null, Validators.required),
        dailyUpdateAt: this.fb.control(null, Validators.required),
        dialPrefix: this.fb.control({ value: null, disabled: true })
      }),
      axl: this.fb.group({
        address: this.fb.control(null),
        username: this.fb.control(null),
        password: this.fb.control(null),
        enableCdrPull: this.fb.control(null),
        cdrPullAddress: this.fb.control(null)
      })
    });
  }

  private patchData(switchboard: SwitchboardModel): void {
    this.switchboardId = switchboard.id;
    this.formGroup.patchValue(switchboard);

    if (this.formGroup.get('cti.dialPrefix').value) {
      this.formGroup.get('cti.dialPrefix').enable();
    }

    if (this.formGroup.get('axl.enableCdrPull').value) {
      this.formGroup.get('axl.cdrPullAddress').disable();
    }
  }

  toggleAxi(value: string): void {
    const validators = value === 'CISCO' ? [Validators.required] : [];
    ['address', 'username', 'password'].forEach(control => {
      this.formGroup.get('axl.' + control).setValidators(validators);
      this.formGroup.get('axl.' + control).updateValueAndValidity();
    });

    if (value !== 'CISCO') {
      this.formGroup.get('axl').reset();
      this.activeTab = 'cti';
    }
  }

  toggleDialPrefix(checked: boolean): void {
    const control = this.formGroup.get('cti.dialPrefix');
    if (checked) {
      control.setValidators([Validators.required, isInteger]);
      control.enable();
    } else {
      control.clearValidators();
      control.disable();
      control.reset();
    }

    control.updateValueAndValidity();
  }

  toggleCdrPullAddress(checked: boolean): void {
    const control = this.formGroup.get('axl.cdrPullAddress');
    if (checked) {
      control.disable();
      control.reset();
    } else {
      control.enable();
    }

    control.updateValueAndValidity();
  }

  toggleInvalidTabs(): void {
    ['cti', 'axl'].forEach(tab => {
      const oppositeTab = tab === 'cti' ? 'axl' : 'cti';

      if (this.activeTab === tab && this.formGroup.get(tab).valid && this.formGroup.get(oppositeTab).invalid) {
        this.activeTab = oppositeTab;
      }
    });
  }

	submit(): void {
    if (this.formGroup.get('type').value === 'CISCO') {
      this.toggleInvalidTabs();
    }

		if (this.formGroup.valid && !this.isSubmitting) {
			this.isSubmitting = true;

			if (this.switchboardId) {
				this.switchboardService.updateSwitchboard(this.switchboardId, this.formGroup.value).then(response => {
          this.handleServerResponse(response);
        });
			} else {
				this.switchboardService.newSwitchboard(this.formGroup.value).then(response => {
          this.handleServerResponse(response);
        });
			}
		}
	}

	private handleServerResponse(response: boolean): void {
		if (response) {
			this.router.navigate(['/platform', 'settings', 'switchboards']);
    } else {
      this.isSubmitting = false;
    }
	}
}
