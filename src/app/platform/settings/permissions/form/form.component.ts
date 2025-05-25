import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription, catchError, from, map, of } from 'rxjs';
import { trigger, transition, style, animate } from '@angular/animations';

import { PermissionService } from 'src/app/_shared/services/http/permission.service';
import { UserSessionService } from 'src/app/_shared/services/state/user-session.service';
import { NotificationService } from 'src/app/_shared/services/generic/notification.service';

import { TranslatePipe } from 'src/app/_shared/pipes/translate/translate.pipe';

import { ErrorMessages } from 'src/app/_shared/constants/error-messages';
import {
  PermissionModel,
  PermissionModules,
  permissionActions,
  permissionActionsMeta
} from 'src/app/_shared/models/permission.model';

/**
 * Interface for module permission form group
 */
interface ModulePermissionForm {
  name: FormControl<string>;
  all: FormControl<boolean>;
  read: FormControl<boolean>;
  create: FormControl<boolean>;
  update: FormControl<boolean>;
  delete: FormControl<boolean>;
}

/**
 * Interface for permission form
 */
interface PermissionForm {
  name: FormControl<string>;
  description: FormControl<string>;
  modules: FormArray;
}

/**
 * Animation definitions
 */
const fadeAnimation = trigger('fadeAnimation', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate('300ms', style({ opacity: 1 })),
  ]),
  transition(':leave', [
    animate('300ms', style({ opacity: 0 })),
  ]),
]);

@Component({
  selector: 'app-permission-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.sass'],
  animations: [fadeAnimation]
})
export class FormComponent implements OnInit, OnDestroy {
  /**
   * Constants and readonly properties
   */
  private readonly subscription = new Subscription();
  readonly errorMessages = ErrorMessages;
  readonly modules = PermissionModules;
  readonly permActions = permissionActions;
  readonly actionKeys = [permissionActions.READ, permissionActions.CREATE, permissionActions.UPDATE, permissionActions.DELETE];

  /**
   * Component state
   */
  permission: PermissionModel | null = null;
  formGroup!: FormGroup<PermissionForm>;
  isSubmitting = false;
  formInitialized = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private permissionService: PermissionService,
    public userSession: UserSessionService,
    private notificationService: NotificationService,
    private translatePipe: TranslatePipe
  ) {}

  /**
   * Initialize component
   */
  ngOnInit(): void {
    // Load permission data if editing
    this.permission = this.route.snapshot.data.permission;
    
    // Initialize form
    this.initializeForm();
    
    // Apply existing values if editing
    if (this.permission) {
      this.populateForm();
    }
    
    this.formInitialized = true;
  }
  
  /**
   * Clean up subscriptions on component destruction
   */
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  
  /**
   * Initialize the form with empty values
   */
  private initializeForm(): void {
    this.formGroup = this.fb.group<PermissionForm>({
      name: this.fb.control('', {
        validators: Validators.required,
        asyncValidators: this.validatePermissionName.bind(this),
        nonNullable: true
      }),
      description: this.fb.control('', { nonNullable: true }),
      modules: this.fb.array([])
    });

    // Initialize module permissions
    this.initializeModules();
  }

  /**
   * Initialize module permissions in the form
   */
  private initializeModules(): void {
    const modulesArray = this.getModulesArray();
    
    this.modules.forEach(moduleName => {
      const moduleGroup = this.createModuleGroup(moduleName);
      modulesArray.push(moduleGroup);
    });
  }

  /**
   * Create a form group for a module's permissions
   */
  private createModuleGroup(moduleName: string): FormGroup<ModulePermissionForm> {
    return this.fb.group<ModulePermissionForm>({
      name: this.fb.control(moduleName, { nonNullable: true }),
      all: this.fb.control(false, { nonNullable: true }),
      read: this.fb.control(false, { nonNullable: true }),
      create: this.fb.control(false, { nonNullable: true }),
      update: this.fb.control(false, { nonNullable: true }),
      delete: this.fb.control(false, { nonNullable: true })
    });
  }

  /**
   * Get action metadata for a specific action key
   */
  getActionData(actionKey: string): { label: string; icon: string } {
    return permissionActionsMeta[actionKey] || { label: actionKey, icon: 'settings' };
  }

  /**
   * Populate form with existing permission data
   */
  private populateForm(): void {
    if (!this.permission) return;

    // Set basic permission info
    this.formGroup.patchValue({
      name: this.permission.name,
      description: this.permission.description || ''
    });

    // Set module permissions
    if (this.permission.modules && Object.keys(this.permission.modules).length) {
      this.applyModulePermissions();
    }
  }

  /**
   * Apply module permissions from the permission model to the form
   */
  private applyModulePermissions(): void {
    if (!this.permission?.modules) return;
    
    const modulesArray = this.getModulesArray();
    
    // Handle new object-based modules structure
    Object.entries(this.permission.modules).forEach(([moduleName, moduleActions]) => {
      const moduleIndex = this.findModuleIndex(moduleName);
      
      if (moduleIndex >= 0) {
        const moduleGroup = modulesArray.at(moduleIndex) as FormGroup<ModulePermissionForm>;
        
        // Create patch object with module name and actions
        const patchObject = {
          name: moduleName,
          ...moduleActions,
          // Calculate 'all' based on all actions being enabled
          all: this.actionKeys.every(action => moduleActions[action])
        };
        
        // Apply permission values
        moduleGroup.patchValue(patchObject);
        
        // Disable read control if any other action is enabled
        if (this.hasNonReadActions(moduleActions)) {
          moduleGroup.get(this.permActions.READ)?.disable();
        }
      }
    });
  }

  /**
   * Check if a module has any non-read actions enabled
   */
  private hasNonReadActions(module: any): boolean {
    return this.actionKeys.some(action =>
      action !== this.permActions.READ && module[action]
    );
  }

  /**
   * Find the index of a module in the form array by name
   */
  private findModuleIndex(moduleName: string): number {
    const modulesArray = this.getModulesArray();
    
    for (let i = 0; i < modulesArray.length; i++) {
      const group = modulesArray.at(i) as FormGroup;
      if (group.get('name')?.value === moduleName) {
        return i;
      }
    }
    
    return -1;
  }

  /**
   * Get the modules form array
   */
  getModulesArray(): FormArray {
    return this.formGroup.get('modules') as FormArray;
  }

  /**
   * Toggle all permissions for all modules
   */
  checkAll(checked: boolean): void {
    const modulesArray = this.getModulesArray();
    
    modulesArray.controls.forEach(control => {
      const group = control as FormGroup;
      
      // Set the 'all' checkbox first
      group.get('all')?.patchValue(checked);
      
      // Apply the value to all actions
      this.checkRow(checked, group);
    });
  }

  /**
   * Toggle all permissions for a specific module
   */
  checkRow(checked: boolean, control: AbstractControl): void {
    const group = control as FormGroup;
    
    // Apply the same value to all action checkboxes
    this.actionKeys.forEach(action => {
      const actionControl = group.get(action);
      if (actionControl) {
        actionControl.setValue(checked);
        
        // Handle read control special case
        if (action === this.permActions.READ) {
          checked ? actionControl.disable() : actionControl.enable();
        }
      }
    });
  }
  
  /**
   * Handle action checkbox changes
   */
  actionChecked(checked: boolean, control: AbstractControl): void {
    const group = control as FormGroup;
    const readControl = group.get(this.permActions.READ);
    const allControl = group.get('all');
    
    if (checked) {
      // When an action is checked, read should also be checked and disabled
      if (readControl?.enabled) {
        readControl.setValue(true);
        readControl.disable();
      }
      
      // Check if all actions are enabled to update 'all' checkbox
      allControl?.setValue(this.actionKeys.every(action =>
        group.get(action)?.value === true
      ));
    } else {
      // When an action is unchecked, 'all' should be unchecked
      allControl?.setValue(false);
      
      // If no non-read actions are enabled, enable the read control
      const hasNonReadActions = this.actionKeys.some(action =>
        action !== this.permActions.READ && group.get(action)?.value === true
      );
      
      if (!hasNonReadActions && readControl) {
        readControl.enable();
      }
    }
  }
  
  /**
   * Update a specific permission action value
   */
  updateActionValue(checked: boolean, control: AbstractControl, actionKey: string): void {
    control.get(actionKey)?.setValue(checked);
  }
  
  /**
   * Get aria label for checkbox accessibility
   */
  getCheckAllAriaLabel(moduleName: string): string {
    return `check_all_for.${moduleName}`;
  }
  
  getActionAriaLabel(actionKey: string): string {
    return this.getActionData(actionKey).label;
  }

  /**
   * Validate permission name for uniqueness
   */
  validatePermissionName(control: FormControl): Observable<{ exists: boolean } | null> {
    // Skip validation if name is empty or unchanged
    if (!control.value || (this.permission && this.permission.name === control.value)) {
      return of(null);
    }

    // Check if the permission name exists
    return from(this.permissionService.permissionExists(control.value, this.permission?._id)).pipe(
      map(response => (response && response.exists) ? { exists: true } : null),
      catchError(() => of(null)) // In case of error, allow submission
    );
  }

  /**
   * Submit the form
   */
  async submit(): Promise<void> {
    // Validate form before submission
    if (!this.formGroup.valid || this.isSubmitting) {
      this.markFormGroupTouched();
      return;
    }
    
    // Set submitting state
    this.isSubmitting = true;
    
    try {
      const formValue = this.prepareFormValues();
      let response: boolean;
      
      if (this.permission) {
        // Update existing permission
        response = await this.permissionService.updatePermission(
          this.permission._id,
          formValue
        );
      } else {
        // Create new permission
        response = await this.permissionService.newPermission(formValue);
      }
      
      this.handleSubmitResponse(response);
    } catch (error) {
      console.error('Error saving permission:', error);
      this.notificationService.error(this.translatePipe.transform('error_saving_permission'));
      this.isSubmitting = false;
    }
  }

  /**
   * Mark all form controls as touched to trigger validation messages
   */
  private markFormGroupTouched(): void {
    Object.keys(this.formGroup.controls).forEach(key => {
      const control = this.formGroup.get(key);
      control?.markAsTouched();
      
      if (key === 'modules' && control instanceof FormArray) {
        control.controls.forEach(group => {
          if (group instanceof FormGroup) {
            Object.keys(group.controls).forEach(groupKey => {
              group.get(groupKey)?.markAsTouched();
            });
          }
        });
      }
    });
  }

  /**
   * Prepare form values for submission
   */
  private prepareFormValues(): any {
    // Get raw form values safely
    const rawValues = this.formGroup.getRawValue();
    
    // Create a new object with the basic properties
    const formValues = {
      name: rawValues.name,
      description: rawValues.description,
      modules: {}
    };
    
    // Get modules array
    const modulesArray = rawValues.modules || [];
    
    // Process and filter modules
    modulesArray.forEach(module => {
      // Check if the module has any action enabled
      const hasAnyAction = this.actionKeys.some(action => module[action] === true);
      
      // Only include modules with at least one action enabled
      if (hasAnyAction) {
        const moduleName = module.name;
        const actionValues = {} as any;
        
        // Copy all action values except 'all'
        this.actionKeys.forEach(action => {
          actionValues[action] = module[action];
        });
        
        // Ensure read permission is set when other actions are enabled
        const hasNonReadActions = this.actionKeys.some(action =>
          action !== this.permActions.READ && module[action]
        );
        
        if (hasNonReadActions) {
          actionValues.read = true;
        }
        
        // Add to modules object with name as key
        formValues.modules[moduleName] = actionValues;
      }
    });
    
    return formValues;
  }

  /**
   * Handle the server response after submission
   */
  private handleSubmitResponse(saved: boolean): void {
    if (saved) {
      this.notificationService.success();
      this.router.navigate(['/platform', 'settings', 'permissions']);
    } else {
      this.isSubmitting = false;
    }
  }
}
