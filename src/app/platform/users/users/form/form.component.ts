import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

import { PasswordComponent } from './password/password.component';

import { UserService } from 'src/app/_shared/services/http/user.service';

import { ErrorMessages } from 'src/app/_shared/constants/error-messages';
import { AuthTypes, UserModel } from 'src/app/_shared/models/user.model';
import { Langs } from 'src/app/_shared/constants/general';
import { EmailPattern, PhonePattern } from 'src/app/_shared/constants/patterns';
import { UnitModel } from 'src/app/_shared/models/unit.model';
import { SelectItemModel } from 'src/app/_shared/models/select-item.model';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['../../../units/unit-tree/unit-tree.component.styl']
})
export class FormComponent implements OnInit, OnDestroy {

  readonly authTypes = AuthTypes;
  readonly langs = Langs;
  readonly errorMessages = ErrorMessages;
  readonly sub = new Subscription();

  readonly rootUnit: UnitModel = {
    id: 'root',
    units: []
  }

  userForm: FormGroup;

  user: UserModel;

  permissions: SelectItemModel[] = [];

  isSubmitting = false;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private dialog: MatDialog,
              private fb: FormBuilder,
              private userService: UserService) {}

  ngOnInit(): void {
    this.userForm = this.fb.group({
      firstName: this.fb.control(null, Validators.required),
      lastName: this.fb.control(null, Validators.required),
      workNumber: this.fb.control(null),
      email: this.fb.control(null, [Validators.required, Validators.pattern(EmailPattern)]),
      mobile: this.fb.control(null),
      phone: this.fb.control(null, Validators.pattern(PhonePattern)),
      authType: this.fb.control(null),
      lang: this.fb.control(null),
      username: this.fb.control(null, Validators.required),
      password: this.fb.control(null, Validators.required),
      permission: this.fb.control(null),
      units: this.fb.control([])
    });

    const routeData = this.route.snapshot.data;

    this.rootUnit.units = routeData.units;
    this.permissions = routeData.permissions;

    this.user = routeData.user;
    if (this.user) {
      this.userForm.patchValue(this.user);
      this.userForm.get('password').clearValidators();

      if (this.user.units === 'root') {
        this.userForm.get('units').patchValue([]);
        this.setUnit(true, this.rootUnit);
      }
    }
  }

  setUnit(checked: boolean, unit?: UnitModel): void {
    const checkedIds = this.userForm.get('units').value;
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
    return this.userForm.get('units').value.indexOf(unitId) !== -1;
  }

  openPasswordDialog(): void {
    const dialog = this.dialog.open(PasswordComponent,{
      width: '400px'
    });

    this.sub.add(dialog.afterClosed().subscribe(password => {
      this.userForm.get('password').patchValue(password);
    }));
  }

  submit(): void {
    if (this.userForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;

      const values = this.userForm.value;
      if (values.units.indexOf('root') !== -1) {
        values.units = 'root';
      }

      if (this.user) {
        this.userService.updateUser(this.user.id, values).then(response => this.handleServerResponse(response));
      } else {
        this.userService.newUser(values).then(response => this.handleServerResponse(response));
      }
    }
  }

  private handleServerResponse(response: boolean): void {
    if (response) {
      this.router.navigate(['/platform', 'users'])
    }

    this.isSubmitting = false;
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
