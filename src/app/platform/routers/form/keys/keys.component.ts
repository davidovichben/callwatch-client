import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { SharedComponent } from 'src/app/platform/routers/form/shared/shared.component';

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

  formGroup: FormGroup;

  constructor(dialog: MatDialog, formService: RouterFormService,
              private fb: FormBuilder, private locale: LocaleService,
              private t: TranslatePipe,
              private notificationService: NotificationService) {
    super(dialog, formService);
  }

  ngOnInit(): void {
    this.formGroup = (this.formService.routerForm.get('keys.' + this.category) as FormGroup);
    this.setKeys();

    this.setUnusedKeys();
    this.activeLang = this.locale.getLocale();
  }

  addKeyGroup(conditionResult?: string, isFirstCondition?: boolean): FormGroup {
    return this.fb.group({
      category: this.fb.control(this.category),
      activityType: this.fb.control(null, Validators.required),
      activityValue: this.fb.control(null),
      conditionSchedule: this.fb.control(null),
      activityTypeName: this.fb.control(null),
      timingType: this.fb.control(null),
      schedule: this.fb.control(null),
      startDateTime: this.fb.control(null),
      endDateTime: this.fb.control(null),
      isActive: this.fb.control(true),
      isDefault: this.fb.control(null),
      isOnline: this.fb.control(true),
      conditionResult: this.fb.control(conditionResult ?? null),
      isFirstCondition: this.fb.control(isFirstCondition ?? null)
    });
  }

  newKey(key: string): void {
    if (!key) {
      this.notificationService.error(this.t.transform('please_select_key'))
      return;
    }

    const arr = this.fb.array([this.addKeyGroup()]);
    this.formGroup.addControl(key, arr);

    this.setUnusedKeys();
  }

  addAction(key: string, index: number): void {
    const arr = (this.formGroup.get(key) as FormArray);
    const conditionResult = arr.at(index).value.conditionResult;
    if (conditionResult) {
      arr.insert(index + 1, this.addKeyGroup(conditionResult));
    } else {
      arr.push(this.addKeyGroup());
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

        const arr = (this.formGroup.get(key) as FormArray);
        const activityType = arr.at(index).value.activityTypeName;

        arr.removeAt(index);

        if (activityType === 'condition') {
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

  activityChanged(activityTypeId: number, action: FormGroup, key: string): void {
    const activityType = this.formService.keyActivityTypes.find(type => type.id === activityTypeId);
    const activityTypeName = activityType.name;

    const prevValue = action.value.activityTypeName;

    action.get('activityTypeName').patchValue(activityType.name);

    if (activityType.hasValue) {
      action.get('activityValue').setValidators(Validators.required);
    }

    action.get('activityValue').updateValueAndValidity();

    const arr = (this.formGroup.get(key) as FormArray);

    if (prevValue === 'condition') {
      const controls = arr.controls.filter(control => !control.get('conditionResult').value);
      arr.clear();
      controls.forEach(control => arr.push(control));
    }

    if (arr && activityTypeName === 'condition') {
      let index = arr.controls.indexOf(action);

      ['true', 'false'].forEach(value => {
        index++;

        const group = this.addKeyGroup(value, true);
        arr.insert(index, group);
      })
    }
  }

  setSMS(action: FormGroup, value: string): void {
    const currentValue = action.get('activityValue').value ?? {};
    currentValue[this.activeLang] = value;

    action.get('activityValue').patchValue(currentValue);
  }

  conditionValueChanged(value: string, action: FormGroup): void {
    action.get('conditionSchedule').setValidators(value === 'schedule' ? Validators.required : null);
    action.get('conditionSchedule').updateValueAndValidity();
  }

  setDefault(group: FormGroup): void {
    this.clearDefault();
    this.hasDefault = true;

    group.get('isDefault').patchValue(true);
  }

  clearDefault(): void {
    this.getKeys().forEach(key => {
      (this.formGroup.get(key) as FormArray).at(0).get('isDefault').patchValue(false);
    })

    this.hasDefault = false;
  }

  getKeys(): string[] {
    return Object.keys(this.formGroup.controls);
  }

  getKeysLength(): number {
    return Object.keys(this.formGroup.controls).length;
  }

  private setKeys(): void {
    const existingKeys = this.formService.router?.keys[this.category];
    if (existingKeys && Object.keys(existingKeys).length > 0) {
      this.setExistingKeys(existingKeys);
    }
  }

  // Patching value, setting first condition and setting files if exist

  private setExistingKeys(existingKeys: object): void {
    Object.keys(existingKeys).forEach(key => {
      const actions = [];
      let conditionResult = null;
      existingKeys[key].forEach(action => {
        const group = this.addKeyGroup();
        group.patchValue(action);

        if (action.conditionResult && action.conditionResult != conditionResult) {
          conditionResult = action.conditionResult;
          group.get('isFirstCondition').patchValue(true);
        }

        actions.push(group);
      });

      this.formGroup.addControl(key, this.fb.array(actions));
    })
  }

  private setUnusedKeys(): void {
    this.unusedKeys = this.keyTypes.filter(keyType => !this.getKeys().includes(keyType));
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
  }
}
