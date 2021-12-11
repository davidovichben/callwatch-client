import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { RouterMessageModel } from 'src/app/_shared/models/router-message.model';
import { RouterKeyModel } from 'src/app/_shared/models/router-key.model';
import { SelectItemModel } from 'src/app/_shared/models/select-item.model';
import { RouterModel } from 'src/app/_shared/models/router.model';

@Injectable()
export class RouterFormService {

  constructor(private fb: FormBuilder) {}

  routerForm: FormGroup;

  schedules: SelectItemModel[] = [];
  routers: SelectItemModel[] = [];
  keyActivityTypes: SelectItemModel[] = [];

  router: RouterModel;

  messages: {
    active: RouterMessageModel[],
    inactive: RouterMessageModel[]
  }

  keys: {
    active: RouterKeyModel[],
    inactive: RouterKeyModel[]
  }

  makeForm(): void {
    this.routerForm = this.fb.group({
      general: this.fb.group({}),
      messages: this.fb.group({
        active: this.fb.array([]),
        inactive: this.fb.array([])
      }),
      keys: this.fb.group({
        active: this.fb.array([]),
        inactive: this.fb.array([])
      }),
    });
  }

  // reset(): void {
  //   this.router = {};
  //   this.messages = {};
  //   this.keys = {};
  // }
}
