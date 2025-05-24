import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

import { PasswordComponent } from './password/password.component';
import { UnitSelectComponent } from 'src/app/_shared/components/unit-select/unit-select.component';

import { UserService } from 'src/app/_shared/services/http/user.service';
import { UserSessionService } from 'src/app/_shared/services/state/user-session.service';
import { NotificationService } from 'src/app/_shared/services/generic/notification.service';

import { UnitModel } from 'src/app/_shared/models/unit.model';
import { SelectItemModel } from 'src/app/_shared/models/select-item.model';
import { AuthTypes, UserModel } from 'src/app/_shared/models/user.model';
import { ErrorMessages } from 'src/app/_shared/constants/error-messages';
import { EmailPattern, PhonePattern } from 'src/app/_shared/constants/patterns';
import { ImageTypes, Megabyte } from 'src/app/_shared/constants/general';
import { Fade } from 'src/app/_shared/constants/animations';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.sass'],
  animations: [Fade]
})
export class FormComponent implements OnInit, OnDestroy {
  @ViewChild(UnitSelectComponent) unitSelect: UnitSelectComponent;

  private readonly subscription = new Subscription();
  
  // Constants and configuration
  readonly authTypes = AuthTypes;
  readonly errorMessages = ErrorMessages;
  readonly avatarErrors = {
    size: false,
    type: false
  };
  
  // Form and data properties
  formGroup: FormGroup;
  loggedUser: UserModel;
  user: UserModel;
  units: UnitModel[] = [];
  permissions: SelectItemModel[] = [];
  languages: SelectItemModel[] = [];
  isSubmitting = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private userService: UserService,
    public userSession: UserSessionService,
    private notifications: NotificationService
  ) {}

  ngOnInit(): void {
    // Load data from route resolvers
    this.loadData();
    
    // Initialize the form
    this.initForm();
    
    // Populate form with user data if editing
    this.populateForm();
  }
  
  /**
   * Load data from route resolvers
   */
  private loadData(): void {
    this.loggedUser = this.userSession.getUser();
    const routeData = this.route.snapshot.data;
    
    this.units = routeData.units || [];
    this.permissions = routeData.permissions || [];
    this.languages = routeData.languages || [];
    this.user = routeData.user;
  }

  /**
   * Initialize the form with default values and validators
   */
  private initForm(): void {
    this.formGroup = this.fb.group({
      firstName: this.fb.control('', { validators: Validators.required, nonNullable: true }),
      lastName: this.fb.control('', { validators: Validators.required, nonNullable: true }),
      workNumber: this.fb.control('', { nonNullable: true }),
      email: this.fb.control('', {
        validators: [Validators.required, Validators.pattern(EmailPattern)],
        nonNullable: true
      }),
      mobile: this.fb.control('', {
        validators: Validators.pattern(PhonePattern),
        nonNullable: true
      }),
      phone: this.fb.control('', {
        validators: Validators.pattern(PhonePattern),
        nonNullable: true
      }),
      username: this.fb.control('', {
        validators: Validators.required,
        asyncValidators: this.checkUsernameUnique.bind(this),
        nonNullable: true
      }),
      password: this.fb.control('', {
        validators: Validators.required,
        nonNullable: true
      }),
      language: this.fb.control(this.loggedUser.language?._id || '', {
        validators: Validators.required,
        nonNullable: true
      }),
      permission: this.fb.control('', {
        nonNullable: true
      }),
      isRoot: this.fb.control(false, { nonNullable: true }),
      units: this.fb.control([], { nonNullable: true }),
      avatar: this.fb.control('', { nonNullable: true })
    });
  }
  
  /**
   * Populate form with user data if in edit mode
   */
  private populateForm(): void {
    if (this.user) {
      this.formGroup.patchValue(this.user);
      
      // Password not required when editing
      this.formGroup.get('password').clearValidators();
      this.formGroup.get('password').updateValueAndValidity();
    }
  }

  /**
   * Upload and validate avatar image
   */
  uploadAvatar(file: File): void {
    // Reset error states
    this.avatarErrors.type = false;
    this.avatarErrors.size = false;
    
    // Validate file type
    if (ImageTypes.indexOf(file.type.substring(6)) === -1) {
      this.avatarErrors.type = true;
      return;
    }
    
    // Validate file size (8MB max)
    if (file.size > 8 * Megabyte) {
      this.avatarErrors.size = true;
      return;
    }
    
    // Read and set the file
    const reader = new FileReader();
    reader.onload = (event => {
      this.formGroup.get('avatar').patchValue(event.target.result);
    });
    reader.readAsDataURL(file);
  }
  
  /**
   * Delete avatar with confirmation
   */
  deleteAvatar(): void {
    this.notifications.warning().then(confirmation => {
      if (confirmation.value) {
        this.formGroup.get('avatar').reset();
      }
    });
  }
  
  /**
   * Open password dialog for setting or changing password
   */
  openPasswordDialog(): void {
    const dialog = this.dialog.open(PasswordComponent, {
      width: '400px',
      data: this.formGroup.get('password').value
    });
  
    this.subscription.add(
      dialog.afterClosed().subscribe(password => {
        if (password) {
          this.formGroup.get('password').patchValue(password);
          this.formGroup.get('password').setValidators(Validators.required);
          this.formGroup.get('password').updateValueAndValidity();
        }
      })
    );
  }

  /**
   * Async validator to check if username is unique
   */
  async checkUsernameUnique(control: FormControl): Promise<{ exists: boolean } | null> {
    // Skip validation if editing and username hasn't changed
    if (this.user && this.user.username === control.value) {
      return null;
    }
    
    try {
      const response = await this.userService.checkExists(control.value);
      return response ? { exists: true } : null;
    } catch (error) {
      // In case of error, allow submission and let server validation handle it
      return null;
    }
  }

  /**
   * Submit the form
   */
  submit(): void {
    // Ensure password has proper validation for new users
    if (!this.user) {
      this.formGroup.get('password').setValidators(Validators.required);
      this.formGroup.get('password').updateValueAndValidity();
    }

    // Validate and submit
    if (this.formGroup.valid && !this.isSubmitting) {
      this.isSubmitting = true;

      // Prepare form values
      const values = this.prepareFormValues();

      // Create or update based on whether we have an existing user
      if (this.user) {
        this.userService.updateUser(this.user._id, values)
          .then(response => this.handleServerResponse(response))
          .catch(() => this.isSubmitting = false);
      } else {
        this.userService.newUser(values)
          .then(response => this.handleServerResponse(response))
          .catch(() => this.isSubmitting = false);
      }
    }
  }
  
  /**
   * Prepare form values for submission
   */
  private prepareFormValues(): any {
    const values = this.formGroup.value;
    
    // Special handling for root units
    if (Array.isArray(values.units) && values.units.indexOf('root') !== -1) {
      values.units = null;
    }
    
    return values;
  }
  
  /**
   * Handle response from server after create/update operations
   */
  private handleServerResponse(response: any): void {
    if (response) {
      // Update current user's avatar if editing own profile
      if (this.user && this.user._id === this.userSession.getUserId() && response.resource?.avatar) {
        this.userSession.updateUser('avatar', response.resource.avatar);
      }

      // Navigate back to users list
      this.router.navigate(['/platform', 'users']);
    } else {
      // Reset submission state if operation failed
      this.isSubmitting = false;
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
