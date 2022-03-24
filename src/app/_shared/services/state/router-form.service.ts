import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { GenericService } from 'src/app/_shared/services/http/generic.service';

import { SelectItemModel } from 'src/app/_shared/models/select-item.model';
import { RouterModel } from 'src/app/_shared/models/router.model';
import { RouterKeyActivityTypeModel } from 'src/app/_shared/models/router-key-activity-type.model';
import { isInteger } from 'src/app/_shared/validators/integer.validator';

@Injectable()
export class RouterFormService {

  constructor(private fb: FormBuilder, private genericService: GenericService) {}

  routerForm: FormGroup;

  schedules: SelectItemModel[] = [];
  routers: SelectItemModel[] = [];
  languages: SelectItemModel[] = [];
  keyActivityTypes: RouterKeyActivityTypeModel[] = [];

  categories = ['active', 'inactive'];

  activeGroup: string;

  router: RouterModel;

  makeForm(): void {
    this.routerForm = this.fb.group({
      general: this.fb.group({
        name: this.fb.control(null, Validators.required, this.checkNameExists.bind(this)),
        tags: this.fb.control(null),
        description: this.fb.control(null),
        schedule: this.fb.control(null),
        irregularTimingEnabled: this.fb.control(null),
        irregularTimingActive: this.fb.control({ value: null, disabled: true }),
        irregularTimingFrom: this.fb.control({ value: null, disabled: true }),
        irregularTimingTo: this.fb.control({ value: null, disabled: true }),
        dialedNumbers: this.fb.control(null),
        adminCode: this.fb.control(null),
        defaultSelectionDuration: this.fb.control(4, isInteger.bind(this)),
        vipEnabled: this.fb.control(null),
        vipDestination: this.fb.control({ value: null, disabled: true }),
        waitingRouterEnabled: this.fb.control(null),
        queuePositionReading: this.fb.control({ value: null, disabled: true }),
        queueWaitingTime: this.fb.control({ value: null, disabled: true }, isInteger),
        queueFile: this.fb.control(null),
          queueFileName: this.fb.control(null)
      }),
      messages: this.fb.group({
        active: this.fb.array([]),
        inactive: this.fb.array([])
      }),
      keys: this.fb.group({
        active: this.fb.group({}),
        inactive: this.fb.group({})
      }),
    });
  }

  patchForm(): void {
    this.routerForm.get('general').patchValue(this.router.general);
    this.patchMessages();
    this.patchKeys();
  }

  patchMessages(): void {
    this.categories.forEach(category => {
      const messages = this.router.messages[category];
      if (messages) {
        messages.forEach(message => {
          const group = this.getMessageGroup(category);
          group.patchValue(message);

          (this.routerForm.get('messages.' + category) as FormArray).push(group);
        });
      }
    })
  }

  patchKeys(): void {
    this.categories.forEach(category => {
      const keys = this.router.keys[category];
      if (keys) {
        Object.keys(keys).forEach(key => {
          const actions = [];

          let conditionResult = null;

          keys[key].forEach(action => {
            const group = this.getKeyGroup(category);
            group.patchValue(action);

            if (action.conditionResult && action.conditionResult != conditionResult) {
              conditionResult = action.conditionResult;
              group.get('isFirstCondition').patchValue(true);
            }

            actions.push(group);
          });

          (this.routerForm.get('keys.' + category) as FormGroup).addControl(key, this.fb.array(actions));
        })
      }
    })
  }

  getMessageGroup(category: string): FormGroup {
    return this.fb.group({
      category: this.fb.control(category),
      type: this.fb.control('message'),
      description: this.fb.control(null),
      tags: this.fb.control(null),
      files: this.fb.control({}),
      router: this.fb.control(null),
      timingType: this.fb.control(null),
      schedule: this.fb.control(null),
      startTime: this.fb.control(null),
      endTime: this.fb.control(null),
      isActive: this.fb.control(true),
      isOnline: this.fb.control(true),
      callTimes: this.fb.control(null)
    });
  }

  getKeyGroup(category: string, conditionResult?: string, isFirstCondition?: boolean): FormGroup {
    return this.fb.group({
      category: this.fb.control(category),
      activityType: this.fb.control(null, Validators.required),
      activityValue: this.fb.control(null),
      conditionSchedule: this.fb.control(null),
      activityTypeName: this.fb.control(null),
      timingType: this.fb.control(null),
      schedule: this.fb.control(null),
      startTime: this.fb.control(null),
      endTime: this.fb.control(null),
      isActive: this.fb.control(true),
      isDefault: this.fb.control(null),
      isOnline: this.fb.control(true),
      conditionResult: this.fb.control(conditionResult ?? null),
      isFirstCondition: this.fb.control(isFirstCondition ?? null)
    });
  }

  checkNameExists(control: FormControl): Promise<object> {
    if (this.router && this.router.general.name === control.value) {
      return Promise.resolve(null);
    }

    return this.genericService.exists('router', control.value).then(response => {
      if (response) {
        return response.exists ? { exists: true } : null;
      }

      return null;
    })
  }

  reset(): void {
    this.routerForm.reset();
    this.router = null;
  }
}
