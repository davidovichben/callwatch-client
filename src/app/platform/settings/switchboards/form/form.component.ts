import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { SwitchboardService } from 'src/app/_shared/services/http/switchboard.service';
import { UserSessionService } from 'src/app/_shared/services/state/user-session.service';

import { ErrorMessages } from 'src/app/_shared/constants/error-messages';
import { SwitchboardModel } from 'src/app/_shared/models/switchboard.model';
import { isInteger } from 'src/app/_shared/validators/integer.validator';
import { SelectItemModel } from 'src/app/_shared/models/select-item.model';

@Component({
	selector: 'app-form',
	templateUrl: './form.component.html',
  styles: [`.margin-fix { margin-top: -25px }`]
})
export class FormComponent implements OnInit {

	readonly errorMessages = ErrorMessages;

  types = [];
  managers = [];

  switchboardId: number;

  formGroup: FormGroup;

  activeType: SelectItemModel;
  activeTab = 'cti';

  isAdmin = false;

  isSubmitting = false;

  constructor(private router: Router, private route: ActivatedRoute,
              private fb: FormBuilder, private switchboardService: SwitchboardService,
              private userSession: UserSessionService) {}

	ngOnInit(): void {
    this.setForm();

    this.isAdmin = this.userSession.getUser().isAdmin;

    const routeData = this.route.snapshot.data;
    this.managers = routeData.managers;
    this.types = routeData.types;

    if (routeData.switchboard) {
      this.switchboardId = routeData.switchboard.id;
      this.formGroup.patchValue(routeData.switchboard);
      this.activeType = this.types.find(type => type.id === this.formGroup.get('type').value);
    } else {
      this.formGroup.patchValue(routeData.defaults);
    }

    this.toggleInputs();
  }

  private setForm(): void {
    this.formGroup = this.fb.group({
      name: this.fb.control(null, Validators.required),
      type: this.fb.control(null, Validators.required),
      domain: this.fb.control(null, Validators.required),
      manager: this.fb.control(null),
      trunk: this.fb.control(null),
      checkSessionElapsedTime: this.fb.control(null, isInteger),
      extraAreaCode: this.fb.control(null),
      dialAgentPrefix: this.fb.control(null),
      customerCustomCode: this.fb.control(null),
      dialNumberPostfix: this.fb.control(null),
      timeToRefreshInfoMS: this.fb.control(null),
      failedMonitorRetryIntervalMins: this.fb.control(null),
      syncClientDateIntervalMins: this.fb.control(null),
      uniteAdjacentBusyCalls: this.fb.control(null),
      maxSecondsDiffToUniteAdjacentBusyCalls: this.fb.control({ value: null, disabled: true }),
      switchTimeDiff: this.fb.control({ value: null, disabled: true }),
      isDNDSupport: this.fb.control(null),
      doSwitchRetrieving: this.fb.control(null),
      cti: this.fb.group({
        username: this.fb.control(null, Validators.required),
        password: this.fb.control(null, Validators.required),
        domainPort: this.fb.control(null),
        serviceEnable: this.fb.control(null),
        outsideDialPrefix: this.fb.control({ value: null, disabled: true }),
        timeToRefresh: this.fb.control(null),
        updateJtapiDevices: this.fb.control(null),
        jtapiControlledDeviceUpdateTime: this.fb.control({ value: null, disabled: true })
      }),
      axl: this.fb.group({
        url: this.fb.control(null),
        username: this.fb.control(null),
        password: this.fb.control(null),
        cdrFilesPath: this.fb.control(null),
        agentsSleepTime: this.fb.control(null),
        cdrSleepTime: this.fb.control(null),
        supportCdrClients: this.fb.control(null),
        cdrMainRepositoryAddress: this.fb.control({ value: null, disabled: true }),
        risDoResetExtensions: this.fb.control(null),
        risExtensionResetMinutes: this.fb.control({ value: null, disabled: true }),
        risStatusCheckMinutes: this.fb.control({ value: null, disabled: true }),
        isPartitionSupport: this.fb.control(null),
        useNonPartitionedDuplicateExtension: this.fb.control(null),
        useOnlyNonPartitionExtensionsForForwardAll: this.fb.control(null)
      })
    });
  }

  private toggleInputs(): void {
    if (this.formGroup.get('uniteAdjacentBusyCalls').value) {
      this.formGroup.get('maxSecondsDiffToUniteAdjacentBusyCalls').enable();
    }

    if (this.formGroup.get('cti.serviceEnable').value) {
      this.formGroup.get('cti.outsideDialPrefix').enable();
    }

    if (this.formGroup.get('cti.updateJtapiDevices').value) {
      this.formGroup.get('cti.jtapiControlledDeviceUpdateTime').enable();
    }

    if (this.formGroup.get('axl.supportCdrClients').value) {
      this.formGroup.get('axl.cdrMainRepositoryAddress').enable();
    }

    if (this.formGroup.get('axl.risDoResetExtensions').value) {
      this.formGroup.get('axl.risExtensionResetMinutes').enable();
      this.formGroup.get('axl.risStatusCheckMinutes').enable();
    }
  }

  toggleAxi(typeId: number): void {
    this.activeType = this.types.find(type => type.id === typeId);

    const validators = this.activeType.name === 'CISCO' ? [Validators.required] : [];
    ['url', 'username', 'password'].forEach(control => {
      this.formGroup.get('axl.' + control).setValidators(validators);
      this.formGroup.get('axl.' + control).updateValueAndValidity();
    });

    if (this.activeType.name !== 'CISCO') {
      this.formGroup.get('axl').reset();
      this.activeTab = 'cti';
    }
  }

  toggleDisabledFields(checked: boolean, fieldNames: string[], validateInteger?: boolean): void {
    fieldNames.forEach(fieldName => {
      this.toggleDisabledField(checked, fieldName, validateInteger);
    })
  }

  toggleDisabledField(checked: boolean, fieldName: string, validateInteger?: boolean): void {
    const control = this.formGroup.get(fieldName);
    if (checked) {
      const validators = [Validators.required];
      if (validateInteger) {
        validators.push(isInteger);
      }

      control.setValidators(validators);
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

      if (this.activeTab === tab && this.formGroup.get(tab).valid && this.formGroup.get(oppositeTab).invalid) {
        this.activeTab = oppositeTab;
      }
    });
  }

	submit(): void {
    if (this.activeType?.name === 'CISCO') {
      this.toggleInvalidTabs();
    }

		if (this.formGroup.valid && !this.isSubmitting) {
			this.isSubmitting = true;

			if (this.switchboardId) {
				this.switchboardService.updateSwitchboard(this.switchboardId, this.formGroup.getRawValue()).then(response => {
          this.handleServerResponse(response);
        });
			} else {
				this.switchboardService.newSwitchboard(this.formGroup.getRawValue()).then(response => {
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
