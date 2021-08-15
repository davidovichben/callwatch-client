import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

import { PasswordComponent } from './password/password.component';

import { ErrorMessages } from 'src/app/_shared/constants/error-messages';
import { AuthTypes, UserModel } from 'src/app/_shared/models/user.model';
import { Langs } from 'src/app/_shared/constants/general';
import { EmailPattern, PhonePattern } from 'src/app/_shared/constants/patterns';
import { UnitModel } from 'src/app/_shared/models/unit.model';
import { SelectItemModel } from 'src/app/_shared/models/select-item.model';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html'
})
export class FormComponent implements OnInit, OnDestroy {

  readonly authTypes = AuthTypes;
  readonly langs = Langs;
  readonly errorMessages = ErrorMessages;
  readonly sub = new Subscription();

  userForm: FormGroup;

  user: UserModel;
  units: UnitModel[] = [];
  permissions: SelectItemModel[] = [];

  file: File;

  isUnitAddingDisabled = false;

  constructor(private route: ActivatedRoute,
              private dialog: MatDialog,
              private fb: FormBuilder) {}

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
      units: this.fb.array([]),
      isRoot: this.fb.control(false)
    });

    const routeData = this.route.snapshot.data;

    this.units = routeData.units;
    this.permissions = routeData.permissions;

    this.user = routeData.user;
    if (this.user) {
      this.userForm.patchValue(this.user);
    }
  }

  // addUnit(data): void {
  //   if (this.isUnitAddingDisabled && !data) {
  //     return;
  //   }
  //
  //   if (data) {
  //     this.isUnitAddingDisabled = false;
  //     this.userForm.get('units')[data.index].unitId = data.unit.id;
  //
  //     this.selectedUnits.push(data.unit);
  //   } else {
  //     this.isUnitAddingDisabled = true;
  //     const unit = { unitId: null, permissionId: null };
  //     this.userForm.get('units').push(unit);
  //   }
  // }
  //
  // removeUnit(): void {
  //   this.isUnitAddingDisabled = false;
  //   (this.userForm.get('units') as FormArray).splice(-1, 1);
  //   this.selectedUnits.splice(-1, 1);
  // }

  openPasswordDialog() {
    const dialog = this.dialog.open(PasswordComponent,{
      width: '400px'
    });

    this.sub.add(dialog.afterClosed().subscribe(password => {
      this.userForm.get('password').patchValue(password);
    }));
  }

  // isUnitLast() {
  //   return key => this.userForm.units.length > 1 && this.userForm.units.length - 1 === key
  // }

  submit(): void {

  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
