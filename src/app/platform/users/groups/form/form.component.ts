import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';

import { GroupService } from 'src/app/_shared/services/http/group.service';

import { ErrorMessages } from 'src/app/_shared/constants/error-messages';
import { UnitModel } from 'src/app/_shared/models/unit.model';
import { GroupModel } from 'src/app/_shared/models/group.model';
import { SelectItemModel } from 'src/app/_shared/models/select-item.model';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['../../../units/unit-tree/unit-tree.component.styl']
})
export class FormComponent {

  readonly errorMessages = ErrorMessages;

  readonly rootUnit: UnitModel = {
    id: 'root',
    units: []
  }

  permissions: SelectItemModel[] = [];
  users: SelectItemModel[] = [];

  groupForm: FormGroup;

  group: GroupModel;

  isSubmitting = false;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private fb: FormBuilder,
              private groupService: GroupService) {}

  ngOnInit() {
    this.groupForm = this.fb.group({
      name: this.fb.control(null, Validators.required),
      permission: this.fb.control(null),
      users: this.fb.control([]),
      units: this.fb.control([])
    });

    const routeData = this.route.snapshot.data;

    this.rootUnit.units = routeData.units;
    this.permissions = routeData.permissions;
    this.users = routeData.users;

    this.group = routeData.group;
    if (this.group) {
      this.groupForm.patchValue(this.group);

      if (this.group.units === 'root') {
        this.groupForm.get('units').patchValue([]);
        this.setUnit(true, this.rootUnit);
      }
    }
  }

  setUnit(checked: boolean, unit?: UnitModel): void {
    const checkedIds = this.groupForm.get('units').value;
    if (checked) {
      checkedIds.push(unit.id);
    } else {
      const index = checkedIds.indexOf(unit.id);
      checkedIds.splice(index, 1);
    }

    if (unit.units) {
      unit.units.forEach(iteratedUnit => {
        this.setUnit(checked, iteratedUnit)
      });
    }
  }

  unitChecked(unitId: any): boolean {
    return this.groupForm.get('units').value.indexOf(unitId) !== -1;
  }

  submit(): void {
    if (this.groupForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;

      const values = this.groupForm.value;
      if (values.units.indexOf('root') !== -1) {
        values.units = 'root';
      }
      if (this.group) {
        this.groupService.updateGroup(this.group.id, values).then(response => this.handleServerResponse(response));
      } else {
        this.groupService.newGroup(values).then(response => this.handleServerResponse(response));
      }
    }
  }

  private handleServerResponse(response: boolean): void {
    if (response) {
      this.router.navigate(['/platform', 'users', 'groups'])
    }

    this.isSubmitting = false;
  }
}
