import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { PermissionService } from 'src/app/_shared/services/http/permission.service';
import { GenericService } from 'src/app/_shared/services/http/generic.service';

import { ErrorMessages } from 'src/app/_shared/constants/error-messages';
import { PermissionActions, PermissionModel, PermissionModules } from 'src/app/_shared/models/permission.model';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.styl']
})
export class FormComponent implements OnInit, AfterViewInit {

  readonly errorMessages = ErrorMessages;
  readonly actions =  PermissionActions;

  permission: PermissionModel;

  formGroup: FormGroup;

  isSubmitting = false;

  constructor(private route: ActivatedRoute, private router: Router,
              private fb: FormBuilder, private permissionService: PermissionService,
              private genericService: GenericService) {}

  ngOnInit(): void {
    this.makeForm();
    this.setModules();

    this.permission = this.route.snapshot.data.permission;
  }

  ngAfterViewInit(): void {
    if (this.permission) {
      setTimeout(() => this.formGroup.patchValue(this.permission), 0);
    }
  }

  private makeForm(): void {
    this.formGroup = this.fb.group({
      name: this.fb.control(null, Validators.required, this.checkExists.bind(this)),
      description: this.fb.control(null),
      modules: this.fb.array([])
    });
  }

  private setModules(): void {
    PermissionModules.forEach(module => {
      const group = this.fb.group({
        name: this.fb.control(module),
        all: this.fb.control(false),
        read: this.fb.control(false),
        create: this.fb.control(false),
        update: this.fb.control(false),
        delete: this.fb.control(false)
      });

      (this.formGroup.get('modules') as FormArray).push(group);
    });
  }

  checkAll(checked: boolean): void {
    (this.formGroup.get('modules') as FormArray).controls.forEach(group => {
      group.get('all').patchValue(checked);
    })
  }

  checkRow(checked: boolean, group: FormGroup): void {
    PermissionActions.forEach(action => {
      group.get(action).patchValue(checked);
      checked ? group.get(action).disable() : group.get(action).enable();
    });
  }

  checkRead(checked: boolean, group: FormGroup): void {
    if (checked && group.get('read').enabled) {
      group.get('read').patchValue(true);
      group.get('read').disable();
    }

    if (!checked) {
      const actionsEnabled = PermissionActions.some(action => action !== 'read' && group.get(action).value);
      if (!actionsEnabled) {
        group.get('read').enable();
      }
    }
  }

  submit(): void {
    if (this.formGroup.valid && !this.isSubmitting) {
      this.isSubmitting = true;

      if (this.permission) {
        this.permissionService.updatePermission(this.permission.id, this.formGroup.getRawValue()).then(response => {
          this.handleSubmitResponse(response);
        })
      } else {
        this.permissionService.newPermission(this.formGroup.getRawValue()).then(response => {
          this.handleSubmitResponse(response);
        })
      }
    }
  }

  private handleSubmitResponse(response: boolean): void {
    if (response) {
      this.router.navigate(['/platform', 'permissions']);
    } else {
      this.isSubmitting = false;
    }
  }

  private checkExists(control: FormControl): Promise<{ exists: boolean }> {
    return this.genericService.exists('permission', control.value, this.permission?.id).then(response => {
      if (response) {
        return response.exists ? { exists: true } : null;
      }

      return null;
    })
  }
}
