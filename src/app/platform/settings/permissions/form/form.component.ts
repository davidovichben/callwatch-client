import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

import { ReassignDialogComponent } from 'src/app/platform/settings/permissions/reassign-dialog/reassign-dialog.component';

import { PermissionService } from 'src/app/_shared/services/http/permission.service';
import { UserSessionService } from 'src/app/_shared/services/state/user-session.service';
import { NotificationService } from 'src/app/_shared/services/generic/notification.service';

import { TranslatePipe } from 'src/app/_shared/pipes/translate/translate.pipe';

import { ErrorMessages } from 'src/app/_shared/constants/error-messages';
import { PermissionActions, PermissionModel, PermissionModules } from 'src/app/_shared/models/permission.model';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.sass']
})
export class FormComponent implements OnInit, AfterViewInit, OnDestroy {

  readonly sub = new Subscription();

  readonly errorMessages = ErrorMessages;
  readonly actions =  PermissionActions;

  permission: PermissionModel;

  formGroup: UntypedFormGroup;

  isSubmitting = false;

  constructor(private route: ActivatedRoute, private router: Router,
              private fb: UntypedFormBuilder, private permissionService: PermissionService,
              public userSession: UserSessionService, private notificationService: NotificationService,
              private t: TranslatePipe, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.makeForm();
    this.setModules();

    this.permission = this.route.snapshot.data.permission;
  }

  ngAfterViewInit(): void {
    if (this.permission) {
      setTimeout(() => {
        this.formGroup.get('name').patchValue(this.permission.name);
        this.formGroup.get('description').patchValue(this.permission.description);
        this.permission.modules.forEach(module => {
          const index = this.formGroup.get('modules').value.findIndex((groupModule: { name: string; }) => groupModule.name === module.name);
          if (!isNaN(index)) {
            (this.formGroup.get('modules') as UntypedFormArray).at(index).patchValue(module);
          }
        })
      }, 0);
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

      (this.formGroup.get('modules') as UntypedFormArray).push(group);
    });
  }

  checkAll(checked: boolean): void {
    (this.formGroup.get('modules') as UntypedFormArray).controls.forEach((group: UntypedFormGroup) => {
      group.get('all').patchValue(checked);
      this.checkRow(checked, group);
    })
  }

  checkRow(checked: boolean, group: UntypedFormGroup): void {
    PermissionActions.forEach(action => {
      group.get(action).patchValue(checked);
    });
  }

  actionChecked(checked: boolean, group: UntypedFormGroup): void {
    if (checked && group.get('read').enabled) {
      group.get('read').patchValue(true);
      group.get('read').disable();
    }

    if (!checked) {
      group.get('all').patchValue(false);

      const actionsEnabled = PermissionActions.some(action => action !== 'read' && group.get(action).value);
      if (!actionsEnabled) {
        group.get('read').enable();
      }
    }
  }

  async confirmDeletePermission(): Promise<void> {
    if (this.permission.userCount > 0) {
      this.reassignPermission();
      return;
    }

    const confirmation = await this.notificationService.warning();
    if (confirmation.value) {
      await this.deletePermission();
    }
  }

  private async reassignPermission(): Promise<void> {
    const permissions = await this.permissionService.selectPermissions();
    const filteredPermissions = permissions.filter(permission => permission._id !== this.permission._id);

    if (filteredPermissions.length === 0) {
      const msg = this.t.transform('create_delete_permission_s');
      this.notificationService.error(msg);
      return;
    }

    const dialog = this.dialog.open(ReassignDialogComponent, {
      data: { permissions: filteredPermissions, userCount: this.permission.userCount },
      width: '500px',
      panelClass: 'no-overflow'
    });

    this.sub.add(dialog.afterClosed().subscribe(async (newPermissionId) => {
      if (newPermissionId) {
        await this.deletePermission(newPermissionId);
      }
    }));
  }

  private async deletePermission(newPermissionId?: string): Promise<void> {
    const response = await this.permissionService.deletePermission(this.permission._id, newPermissionId);
    if (response) {
      this.notificationService.success();
      await this.router.navigate(['/platform', 'settings', 'permissions']);
    }
  }

  async submit(): Promise<void> {
    if (!this.formGroup.valid || this.isSubmitting) {
      return;
    }
    
    this.isSubmitting = true;

    let response;
    if (this.permission) {
      response = await this.permissionService.updatePermission(this.permission._id, this.formGroup.getRawValue());
    } else {
      response = await this.permissionService.newPermission(this.formGroup.getRawValue());
    }
    
    this.handleSubmitResponse(response);
  }

  private handleSubmitResponse(response: boolean): void {
    if (response) {
      this.router.navigate(['/platform', 'settings', 'permissions']);
    } else {
      this.isSubmitting = false;
    }
  }

  private async checkExists(control: UntypedFormControl): Promise<{ exists: boolean }> {
    const response = await this.permissionService.permissionExists(control.value, this.permission?._id);
    if (response) {
      return response.exists ? { exists: true } : null;
    }

    return null;
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
