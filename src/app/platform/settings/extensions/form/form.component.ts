import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { ExtensionService } from 'src/app/_shared/services/http/extension.service';

import { ErrorMessages } from 'src/app/_shared/constants/error-messages';
import { EmailPattern } from 'src/app/_shared/constants/patterns';
import { ExtensionModel } from 'src/app/_shared/models/extension.model';
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
    { label: 'associated_groups', value: 'acds' },
    { label: 'callback', value: 'callback' }
  ];

  readonly errorMessages = ErrorMessages;

  selects = {
    acds: [],
    types: [],
    switchboards: [],
    callbacks: [],
    routers: []
  };

  activeTab = 'general';

  formGroup: FormGroup;
  extension: ExtensionModel;

  isSubmitting = false;

  constructor(private router: Router, private route: ActivatedRoute,
              private fb: FormBuilder, private extensionService: ExtensionService) {}

  ngOnInit(): void {
    this.makeForm();

    const routeData = this.route.snapshot.data;
    this.selects = routeData.selects;
    if (routeData.extension) {
      this.extension = routeData.extension;
    }

    if (this.extension) {
      this.addDialNumber();
      this.formGroup.patchValue(this.extension);
    } else {
      this.addDialNumbers();
    }

    this.setFormSubscriptions();
  }

  private makeForm(): void {
    this.formGroup = this.fb.group({
      general: this.fb.group({
        name: this.fb.control(null, Validators.required),
        type: this.fb.control(null),
        switchboard: this.fb.control(null, Validators.required),
        description: this.fb.control(null)
      }),
      acds: this.fb.control(null),
      callback: this.fb.group({
        callback: this.fb.control(null),
        router: this.fb.control(null),
        overflowNumber: this.fb.control(null, isInteger),
        email: this.fb.control(null, Validators.pattern(EmailPattern)),
        dialerCallerID: this.fb.control(null)
      })
    })
  }

  private setFormSubscriptions(): void {
    const sub = this.formGroup.get('general.switchboard').valueChanges.subscribe(() => {
      const controlName = this.extension ? 'dialNumber' : 'dialNumbers';
      this.formGroup.get('general.' + controlName).updateValueAndValidity();
    });

    this.sub.add(sub);
  }

  dialNumberChange(number: string, type: string): void {
    if (type === 'from') {
      const numberToControl = this.formGroup.get('general.dialNumbers.to');
      if (!numberToControl.value) {
        numberToControl.patchValue(number);
      }
    }

    if (type === 'to') {
      const numberFromControl = this.formGroup.get('general.dialNumbers.from');
      if (!numberFromControl.value) {
        numberFromControl.patchValue(number);
      }
    }
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
        },
        asyncValidator: this.checkDialNumbersExist.bind(this)
    });

    (this.formGroup.get('general') as FormGroup).addControl('dialNumbers', group);
  }

  private addDialNumber(): void {
    const control = this.fb.control(null, null, this.checkDialNumberExist.bind(this));
    (this.formGroup.get('general') as FormGroup).addControl('dialNumber', control);
  }

  submit(): void {
    if (!this.formGroup.valid) {
      this.toggleInvalidTabs();
    }

    if (this.formGroup.valid && !this.isSubmitting) {
      this.isSubmitting = true;

      const values = {
        ...this.formGroup.value.general,
        ...this.formGroup.value.callback,
        acds: this.formGroup.value.acds
      };

      if (this.extension) {
        this.extensionService.updateExtension(this.extension.id, values).then(response => this.handleServerResponse(response));
      } else {
        this.extensionService.newExtension(values).then(response => this.handleServerResponse(response));
      }
    }
  }

  private checkDialNumbersExist(group: FormGroup): Promise<object> {
    const switchboardId = this.formGroup.get('general.switchboard').value;
    if (!switchboardId || !group.value.from || !group.value.to) {
      return Promise.resolve(null);
    }

    return this.extensionService.checkDialNumbersUnique(group.value.from, group.value.to, switchboardId).then(response => {
      if (response) {
        return response.exists ? { exists: true } : null;
      }

      return null;
    });
  }

  private checkDialNumberExist(control: FormControl): Promise<object> {
    const switchboardId = this.formGroup.get('general.switchboard').value;
    if (!switchboardId || !control.value) {
      return Promise.resolve(null);
    }

    if (control.value === this.extension.general.dialNumber) {
      return Promise.resolve(null);
    }

    return this.extensionService.checkDialNumbersUnique(control.value, control.value, switchboardId).then(response => {
      if (response) {
        return response.exists ? { exists: true } : null;
      }

      return null;
    });
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
      this.router.navigate(['/platform', 'settings', 'extensions']);
    } else {
      this.isSubmitting = false;
    }
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
