import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

import { PasswordComponent } from 'src/app/platform/users/form/password/password.component';
import { UnitSelectComponent } from 'src/app/_shared/components/unit-select/unit-select.component';

import { UserService } from 'src/app/_shared/services/http/user.service';
import { UserSessionService } from 'src/app/_shared/services/state/user-session.service';

import { ErrorMessages } from 'src/app/_shared/constants/error-messages';
import { AuthTypes, UserModel } from 'src/app/_shared/models/user.model';
import { Locales } from 'src/app/_shared/constants/modules';
import { EmailPattern, PhonePattern } from 'src/app/_shared/constants/patterns';
import { UnitModel } from 'src/app/_shared/models/unit.model';
import { SelectItemModel } from 'src/app/_shared/models/select-item.model';
import { ImageTypes, Megabyte } from 'src/app/_shared/constants/general';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styles: [`img { width: 175px; height: 175px; }`]
})
export class FormComponent implements OnInit, OnDestroy {

  @ViewChild(UnitSelectComponent) unitSelect: UnitSelectComponent;

  readonly authTypes = AuthTypes;
  readonly locales = Locales;
  readonly errorMessages = ErrorMessages;
  readonly sub = new Subscription();

  readonly avatarErrors = {
    size: false,
    type: false
  }

  userForm: FormGroup;

  user: UserModel;
  permissions: SelectItemModel[] = [];
  units: UnitModel[] = [];

  isSubmitting = false;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private dialog: MatDialog,
              private fb: FormBuilder,
              private userService: UserService,
              public userSession: UserSessionService) {}

  ngOnInit(): void {
    this.setForm();

    const routeData = this.route.snapshot.data;

    this.units = routeData.units;
    this.permissions = routeData.permissions;

    this.user = routeData.user;
    if (this.user) {
      this.userForm.patchValue(this.user);
      this.userForm.get('password').clearValidators();

      if (this.user.units === 'root') {
        this.userForm.get('units').patchValue([]);
        this.unitSelect.checkAll(true);
      }
    }
  }

  private setForm(): void {
    this.userForm = this.fb.group({
      firstName: this.fb.control(null, Validators.required),
      lastName: this.fb.control(null, Validators.required),
      workNumber: this.fb.control(null),
      username: this.fb.control(null, [Validators.required, Validators.pattern(EmailPattern)], this.checkUsernameUnique.bind(this)),
      mobile: this.fb.control(null, Validators.pattern(PhonePattern)),
      phone: this.fb.control(null, Validators.pattern(PhonePattern)),
      authType: this.fb.control(null),
      locale: this.fb.control(null),
      password: this.fb.control(null, Validators.required),
      permission: this.fb.control(null),
      units: this.fb.control([]),
      avatar: this.fb.control(null)
    });
  }

  uploadAvatar(file: File): void {
    const reader = new FileReader();
    reader.onload = (event => {
      this.userForm.get('avatar').patchValue(event.target.result);
    });

    this.avatarErrors.type = false;
    this.avatarErrors.size = false;

    console.log(file.size)

    if (ImageTypes.indexOf(file.type.substr(6)) === -1) {
      this.avatarErrors.type = true;
      return;
    }

    if (file.size > 8 * Megabyte) {
      this.avatarErrors.size = true;
      return;
    }

    reader.readAsDataURL(file);
  }

  openPasswordDialog(): void {
    const dialog = this.dialog.open(PasswordComponent,{
      width: '400px'
    });

    this.sub.add(dialog.afterClosed().subscribe(password => {
      this.userForm.get('password').patchValue(password);
    }));
  }

  checkUsernameUnique(control: FormControl): Promise<{ exists: boolean }> {
    if (this.user && this.user.username === control.value) {
      return Promise.resolve(null);
    }

    return this.userService.checkExists(control.value).then(response => {
      if (response) {
        return response.exists ? { exists: true } : null;
      }

      return null;
    });
  }

  resetPermission(event: Event): void {
    event.stopPropagation();
    this.userForm.get('permission').reset();
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
