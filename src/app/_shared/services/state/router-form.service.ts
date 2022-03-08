import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { SelectItemModel } from 'src/app/_shared/models/select-item.model';
import { RouterModel } from 'src/app/_shared/models/router.model';
import { RouterKeyActivityTypeModel } from 'src/app/_shared/models/router-key-activity-type.model';

@Injectable()
export class RouterFormService {

  constructor(private fb: FormBuilder) {}

  routerForm: FormGroup;

  schedules: SelectItemModel[] = [];
  routers: SelectItemModel[] = [];
  keyActivityTypes: RouterKeyActivityTypeModel[] = [];

  router: RouterModel;

  makeForm(): void {
    this.routerForm = this.fb.group({
      general: this.fb.group({}),
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

  reset(): void {
    this.routerForm.reset();
    this.router = null;
  }
}
