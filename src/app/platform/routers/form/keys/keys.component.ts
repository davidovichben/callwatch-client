import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { SharedComponent } from 'src/app/platform/routers/form/shared/shared.component';

import { HelpersService } from 'src/app/_shared/services/generic/helpers.service';
import { LocaleService } from 'src/app/_shared/services/state/locale.service';
import { NotificationService } from 'src/app/_shared/services/generic/notification.service';
import { RouterFormService } from 'src/app/_shared/services/state/router-form.service';

import { TranslatePipe } from 'src/app/_shared/pipes/translate/translate.pipe';

import { RouterKeyConditions, RouterKeyTypes } from 'src/app/_shared/models/router-key.model';

@Component({
  selector: 'app-keys',
  templateUrl: './keys.component.html',
  styleUrls: ['./keys.component.styl', '../shared/shared.component.styl']
})
export class KeysComponent extends SharedComponent implements OnInit, OnDestroy {

  readonly types = RouterKeyTypes;
  readonly conditions = RouterKeyConditions;

  unusedTypes = [];

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

    this.setUnusedTypes();
    this.activeLang = this.locale.getLocale();
  }

  addKeyGroup(type: string, conditionResult?: string, isFirstCondition?: boolean): FormGroup {
    const group =  this.fb.group({
      category: this.fb.control(this.category),
      activityType: this.fb.control(null),
      activityValue: this.fb.control(null),
      scheduleCondition: this.fb.control(null),
      activityTypeName: this.fb.control(null),
      files: this.fb.control({}),
      router: this.fb.control(null),
      // documenting: this.fb.control(null),
      timingType: this.fb.control(null),
      schedule: this.fb.control(null),
      startDateTime: this.fb.control(null),
      endDateTime: this.fb.control(null),
      isActive: this.fb.control(true),
      isDefault: this.fb.control(false),
      isOnline: this.fb.control(true),
      conditionResult: this.fb.control(conditionResult ?? null),
      isFirstCondition: this.fb.control(isFirstCondition ?? null)
    });

    this.sub.add(group.get('activityTypeName').valueChanges.subscribe(value => {
      if (value) {
        this.activityChanged(value, type, group);
      }
    }));

    return group;
  }

  private activityChanged(value: string, type: string, group: FormGroup): void {
    const prevValue = group.value.activityTypeName;
    const arr = (this.formGroup.get(type) as FormArray);

    if (prevValue === 'condition') {
      const controls = arr.controls.filter(control => !control.get('conditionResult').value);
      arr.clear();
      controls.forEach(control => arr.push(control));
    }

    if (value === 'condition') {
      let index = arr.controls.indexOf(group);

      ['true', 'false'].forEach(value => {
        index++;

        const group = this.addKeyGroup(type, value, true);
        arr.insert(index, group);
      })
    }
  }

  newKey(type: string): void {
    if (!type) {
      this.notificationService.error(this.t.transform('please_select_key'))
      return;
    }

    const arr = this.fb.array([this.addKeyGroup(type)]);
    this.formGroup.addControl(type, arr);

    this.setUnusedTypes();
  }

  deleteAction(type: string, index: number): void {
    const arr = (this.formGroup.get(type) as FormArray);
    arr.removeAt(index);
    if (arr.length === 0) {
      this.formGroup.removeControl(type);
      this.setUnusedTypes();
    }
  }

  addAction(type: string, index: number): void {
    const arr = (this.formGroup.get(type) as FormArray);
    const conditionResult = arr.at(index).value.conditionResult;
    if (conditionResult) {
      arr.insert(index + 1, this.addKeyGroup(type, conditionResult));
    } else {
      arr.push(this.addKeyGroup(type));
    }
  }

  setDefault(group: FormGroup): void {
    this.getKeys().forEach(key => {
      (this.formGroup.get(key) as FormArray).at(0).patchValue(false);
    })
    group.get('isDefault').patchValue(true);
  }

  getKeys(): string[] {
    return Object.keys(this.formGroup.controls);
  }

  getKeysLength(): number {
    return Object.keys(this.formGroup.controls).length;
  }

  setActivityName(key: FormGroup, activityTypeId: number): void {
    const type = this.formService.keyActivityTypes.find(type => type.id === activityTypeId);
    key.get('activityTypeName').patchValue(type.name);
  }

  private setKeys(): void {
    const existingKeys = this.formService.router?.keys[this.category];
    if (existingKeys && Object.keys(existingKeys).length > 0) {
      this.setExistingKeys(existingKeys);
    } else {
      this.types.slice(0, 3).forEach(type => {
        const arr = this.fb.array([this.addKeyGroup(type)]);
        this.formGroup.addControl(type, arr);
      });
    }
  }

  // Patching value, setting first condition and setting files if exist

  private setExistingKeys(existingKeys: object): void {
    const actionsWithFiles = [];

    Object.keys(existingKeys).forEach(type => {
      const actions = [];
      let conditionResult = null;
      existingKeys[type].forEach(action => {
        const group = this.addKeyGroup(type);
        group.patchValue(action);

        if (action.conditionResult && action.conditionResult != conditionResult) {
          conditionResult = action.conditionResult;
          group.get('isFirstCondition').patchValue(true);
        }

        if (action.activityTypeName === 'audio_message') {
          actionsWithFiles.push(action);
        }

        actions.push(group);
      });

      this.formGroup.addControl(type, this.fb.array(actions));
    })
  }

  private setUnusedTypes(): void {
    this.unusedTypes = this.types.filter(type => !this.getKeys().includes(type));
  }
}
