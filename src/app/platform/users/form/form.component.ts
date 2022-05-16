import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

import { PasswordComponent } from 'src/app/platform/users/form/password/password.component';
import { UnitSelectComponent } from 'src/app/_shared/components/unit-select/unit-select.component';

import { UserService } from 'src/app/_shared/services/http/user.service';
import { UserSessionService } from 'src/app/_shared/services/state/user-session.service';
import { NotificationService } from 'src/app/_shared/services/generic/notification.service';

import { TranslatePipe } from 'src/app/_shared/pipes/translate/translate.pipe';

import { ErrorMessages } from 'src/app/_shared/constants/error-messages';
import { AuthTypes, UserModel } from 'src/app/_shared/models/user.model';
import { EmailPattern, PhonePattern } from 'src/app/_shared/constants/patterns';
import { UnitModel } from 'src/app/_shared/models/unit.model';
import { SelectItemModel } from 'src/app/_shared/models/select-item.model';
import { ImageTypes, Megabyte } from 'src/app/_shared/constants/general';
import { Fade } from 'src/app/_shared/constants/animations';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.styl'],
  animations: [Fade]
})
export class FormComponent implements OnInit, OnDestroy {

  @ViewChild(UnitSelectComponent) unitSelect: UnitSelectComponent;

  readonly sub = new Subscription();

  readonly authTypes = AuthTypes;
  readonly errorMessages = ErrorMessages;
  readonly avatarErrors = {
    size: false,
    type: false
  }

  loggedUser: UserModel;

  formGroup: FormGroup;

  user: UserModel;
  units: UnitModel[] = [];
  permissions: SelectItemModel[] = [];
  languages: SelectItemModel[] = [];

  isSubmitting = false;

  constructor(private route: ActivatedRoute, private router: Router,
              private dialog: MatDialog, private fb: FormBuilder,
              private userService: UserService, public userSession: UserSessionService,
              private notifications: NotificationService, private t: TranslatePipe) {}

  ngOnInit(): void {
    this.loggedUser = this.userSession.getUser();

    this.setForm();

    const routeData = this.route.snapshot.data;

    this.units = routeData.units;
    this.permissions = routeData.permissions;
    this.languages = routeData.languages;
    this.user = routeData.user;

    if (this.user) {
      this.formGroup.patchValue(this.user);
    }
  }

  private setForm(): void {
    this.formGroup = this.fb.group({
      firstName: this.fb.control(null, Validators.required),
      lastName: this.fb.control(null, Validators.required),
      workNumber: this.fb.control(null),
      email: this.fb.control(null, [Validators.required, Validators.pattern(EmailPattern)]),
      mobile: this.fb.control(null, Validators.pattern(PhonePattern)),
      phone: this.fb.control(null, Validators.pattern(PhonePattern)),
      authType: this.fb.control(null),
      username: this.fb.control(null, Validators.required, this.checkUsernameUnique.bind(this)),
      password: this.fb.control(null, Validators.required),
      language: this.fb.control(this.loggedUser.language?.id, Validators.required),
      permission: this.fb.control(null, Validators.required),
      isRoot: this.fb.control(null),
      units: this.fb.control([], null),
      avatar: this.fb.control(null)
    });
  }

  uploadAvatar(file: File): void {
    const reader = new FileReader();
    reader.onload = (event => {
      this.formGroup.get('avatar').patchValue(event.target.result);
    });

    this.avatarErrors.type = false;
    this.avatarErrors.size = false;

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

  deleteAvatar(): void {
    this.notifications.warning().then(confirmation => {
      if (confirmation.value) {
        this.formGroup.get('avatar').reset();
      }
    });
  }

  openPasswordDialog(): void {
    console.log(this.formGroup.get('password').value)

    const dialog = this.dialog.open(PasswordComponent,{
      width: '400px',
      data: this.formGroup.get('password').value
    });

    this.sub.add(dialog.afterClosed().subscribe(password => {
      if (password) {
        this.formGroup.get('password').patchValue(password);
      }
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

  submit(): void {
    if (!this.user) {
      this.formGroup.get('password').setValidators(Validators.required);
      this.formGroup.get('password').updateValueAndValidity();
    }

    if (this.formGroup.valid && !this.isSubmitting) {
      this.isSubmitting = true;

      const values = this.formGroup.value;
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

  deleteUser(): void {
    const msg = this.t.transform('delete_user') + '?';
    this.notifications.warning(msg).then(confirmation => {
      if (confirmation.value && !this.isSubmitting) {
        this.isSubmitting = true;

        this.userService.deleteUser(this.user.id).then(response => {
          this.handleServerResponse(response);
        });
      }
    })
  }

  private handleServerResponse(response: any): void {
    if (response) {
      if (this.user && this.user.id === this.userSession.getUserId()) {
        this.userSession.updateUser('avatar', response.resource.avatar);
      }

      this.router.navigate(['/platform', 'users'])
    } else {
      this.isSubmitting = false;
    }
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
