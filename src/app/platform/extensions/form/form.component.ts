import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { ExtensionService } from 'src/app/_shared/services/http/extension.service';

import { ErrorMessages } from 'src/app/_shared/constants/error-messages';
import { EmailPattern } from 'src/app/_shared/constants/patterns';
import { ExtensionModel } from 'src/app/_shared/models/extension.model';
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
    { label: 'associated_groups', value: 'acds' },
    { label: 'callback', value: 'callback' }
  ];

  readonly errorMessages = ErrorMessages;

  selects = {
    acds: [],
    types: [],
    units: [],
    callbacks: [],
    routers: []
  };

  activeTab = 'general';

  extensionForm: FormGroup;
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
      this.extensionForm.patchValue(this.extension);
    } else {
      this.addDialNumbers();
    }

    this.setFormSubscriptions();
  }

  private makeForm(): void {
    this.extensionForm = this.fb.group({
      general: this.fb.group({
        name: this.fb.control(null, Validators.required),
        type: this.fb.control(null, Validators.required),
        unit: this.fb.control(null, Validators.required),
        description: this.fb.control(null)
      }),
      acds: this.fb.control(null),
      callback: this.fb.group({
        callback: this.fb.control(null),
        router: this.fb.control(null),
        overflowNumber: this.fb.control(null),
        email: this.fb.control(null, Validators.pattern(EmailPattern)),
        dialerCallerID: this.fb.control(null)
      })
    })
  }

  private setFormSubscriptions(): void {
    const sub = this.extensionForm.get('general.unit').valueChanges.subscribe(() => {
      const controlName = this.extension ? 'dialNumber' : 'dialNumbers';
      this.extensionForm.get('general.' + controlName).updateValueAndValidity();
    });

    this.sub.add(sub);
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

    (this.extensionForm.get('general') as FormGroup).addControl('dialNumbers', group);
  }

  private addDialNumber(): void {
    const control = this.fb.control(null, null, this.checkDialNumberExist.bind(this));
    (this.extensionForm.get('general') as FormGroup).addControl('dialNumber', control);
  }

  submit(): void {
    if (!this.extensionForm.valid) {
      this.toggleInvalidTabs();
    }

    if (this.extensionForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;

      const values = {};
      Object.keys(this.extensionForm.value).forEach(groupName => {
        Object.assign(values, this.extensionForm.value[groupName]);
      })

      if (this.extension) {
        this.extensionService.updateExtension(this.extension.id, values).then(response => this.handleServerResponse(response));
      } else {
        this.extensionService.newExtension(values).then(response => this.handleServerResponse(response));
      }
    }
  }

  private checkDialNumbersExist(group: FormGroup): Promise<object> {
    const unitId = this.extensionForm.get('general.unit').value;
    if (!unitId || !group.value.from || !group.value.to) {
      return Promise.resolve(null);
    }

    return this.extensionService.checkDialNumbersUnique(group.value.from, group.value.to, unitId).then(response => {
      if (response) {
        return response.exists ? { exists: true } : null;
      }

      return null;
    });
  }

  private checkDialNumberExist(control: FormControl): Promise<object> {
    const unitId = this.extensionForm.get('general.unit').value;
    if (!unitId || !control.value) {
      return Promise.resolve(null);
    }

    if (control.value === this.extension.general.dialNumber) {
      return Promise.resolve(null);
    }

    return this.extensionService.checkDialNumbersUnique(control.value, control.value, unitId).then(response => {
      if (response) {
        return response.exists ? { exists: true } : null;
      }

      return null;
    });
  }

  private toggleInvalidTabs(): void {
    this.tabs.forEach(tab => {
      if (this.extensionForm.get(tab.value).invalid) {
        this.activeTab = tab.value;
        return;
      }
    });
  }

  private handleServerResponse(response: boolean): void {
    if (response) {
      this.router.navigate(['/platform', 'extensions']);
    }

    this.isSubmitting = false;
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
