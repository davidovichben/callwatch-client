import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';

import { SharedComponent } from 'src/app/platform/settings/routers/form/shared/shared.component';

import { LocaleService } from 'src/app/_shared/services/state/locale.service';
import { NotificationService } from 'src/app/_shared/services/generic/notification.service';
import { RouterFormService } from 'src/app/_shared/services/state/router-form.service';

import { TranslatePipe } from 'src/app/_shared/pipes/translate/translate.pipe';

import { RouterKeyConditions, RouterKeyTypes } from 'src/app/_shared/models/router-key.model';
import { ErrorMessages } from 'src/app/_shared/constants/error-messages';

@Component({
  selector: 'app-keys',
  templateUrl: './keys.component.html',
  styleUrls: ['./keys.component.styl', '../shared/shared.component.styl']
})
export class KeysComponent extends SharedComponent implements OnInit, OnDestroy {

  readonly errorMessages = ErrorMessages;
  readonly keyTypes = RouterKeyTypes;
  readonly conditions = RouterKeyConditions;

  unusedKeys = [];

  hasDefault = false;

  formGroup: UntypedFormGroup;

  isLoading = false;

  constructor(dialog: MatDialog, formService: RouterFormService, router: Router,
              private route: ActivatedRoute, private fb: UntypedFormBuilder, public locale: LocaleService,
              private t: TranslatePipe, private notificationService: NotificationService) {
    super(dialog, router, formService);
  }

  ngOnInit(): void {
    this.sub.add(this.route.params.subscribe(params => {
      this.setLanguage();

      this.category = params.category;
      this.formGroup = (this.formService.routerForm.get('keys.' + this.category) as UntypedFormGroup);
      this.formService.activeGroup = 'messages.' + this.category;

      this.setUnusedKeys();

      if (this.formService.router && this.formService.router.keys[this.category]) {
        this.isLoading = true;

        setTimeout(() => this.isLoading = false, 0);
      }
    }))
  }

  newKey(key: string): void {
    if (!key) {
      this.notificationService.error(this.t.transform('please_select_key'))
      return;
    }

    const arr = this.fb.array([this.formService.getKeyGroup(this.category)]);
    this.formGroup.addControl(key, arr);

    this.setUnusedKeys();
  }

  addAction(key: string, index: number): void {
    const arr = (this.formGroup.get(key) as UntypedFormArray);
    const conditionResult = arr.at(index).value.conditionResult;
    if (conditionResult) {
      arr.insert(index + 1, this.formService.getKeyGroup(conditionResult));
    } else {
      arr.push(this.formService.getKeyGroup(this.category));
    }
  }

  deleteAction(key: string, index: number): void {
    this.notificationService.warning().then(confirmation => {
      if (confirmation.value) {

        if (index === 0) {
          this.formGroup.removeControl(key);
          this.setUnusedKeys();
          return;
        }

        const arr = (this.formGroup.get(key) as UntypedFormArray);
        const activityType = arr.at(index).value.activityTypeName;

        arr.removeAt(index);

        if (activityType === 'Condition') {
          while (arr.at(index) && arr.at(index).value.conditionResult) {
            arr.removeAt(index);
          }
        }

        if (arr.length === 0 || index === 0) {
          this.formGroup.removeControl(key);
          this.setUnusedKeys();
        }

      }
    })
  }

  activityChanged(activityTypeId: number, action: UntypedFormGroup, key: string): void {
    const activityType = this.formService.keyActivityTypes.find(type => type.id === activityTypeId);
    const activityTypeName = activityType.name;

    const prevValue = action.value.activityTypeName;

    action.get('activityTypeName').patchValue(activityType.name);

    if (activityType.hasValue) {
      action.get('activityValue').setValidators(Validators.required);
    }

    action.get('activityValue').updateValueAndValidity();

    const arr = (this.formGroup.get(key) as UntypedFormArray);

    if (prevValue === 'Condition') {
      const controls = arr.controls.filter(control => !control.get('conditionResult').value);
      arr.clear();
      controls.forEach(control => arr.push(control));
    }

    if (arr && activityTypeName === 'Condition') {
      let index = arr.controls.indexOf(action);

      ['true', 'false'].forEach(value => {
        index++;

        const group = this.formService.getKeyGroup(this.category, value, true);
        arr.insert(index, group);
      })
    }
  }

  setSMS(action: UntypedFormGroup, value: string): void {
    const currentValue = action.get('activityValue').value ?? {};
    currentValue[this.activeLang] = value;

    action.get('activityValue').patchValue(currentValue);
  }

  conditionValueChanged(value: string, action: UntypedFormGroup): void {
    action.get('conditionSchedule').setValidators(value === 'schedule' ? Validators.required : null);
    action.get('conditionSchedule').updateValueAndValidity();
  }

  setDefault(group: UntypedFormGroup): void {
    this.clearDefault();
    this.hasDefault = true;

    group.get('isDefault').patchValue(true);
  }

  clearDefault(): void {
    this.getKeys().forEach(key => {
      (this.formGroup.get(key) as UntypedFormArray).at(0).get('isDefault').patchValue(false);
    })

    this.hasDefault = false;
  }

  getKeys(): string[] {
    return Object.keys(this.formGroup.controls);
  }

  getKeysLength(): number {
    return Object.keys(this.formGroup.controls).length;
  }

  private setUnusedKeys(): void {
    this.unusedKeys = this.keyTypes.filter(keyType => !this.getKeys().includes(keyType));
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
  }
}
