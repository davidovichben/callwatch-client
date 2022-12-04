import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

import { ReassignDialogComponent } from 'src/app/platform/settings/permissions/reassign-dialog/reassign-dialog.component';

import { PermissionService } from 'src/app/_shared/services/http/permission.service';
import { GenericService } from 'src/app/_shared/services/http/generic.service';
import { UserSessionService } from 'src/app/_shared/services/state/user-session.service';
import { SelectService } from 'src/app/_shared/services/http/select.service';
import { NotificationService } from 'src/app/_shared/services/generic/notification.service';

import { TranslatePipe } from 'src/app/_shared/pipes/translate/translate.pipe';

import { ErrorMessages } from 'src/app/_shared/constants/error-messages';
import { PermissionActions, PermissionModel, PermissionModules } from 'src/app/_shared/models/permission.model';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.styl']
})
export class FormComponent implements OnInit, AfterViewInit, OnDestroy {

  readonly sub = new Subscription();

  readonly errorMessages = ErrorMessages;
  readonly actions =  PermissionActions;

  permission: PermissionModel;

  formGroup: FormGroup;

  isSubmitting = false;

  constructor(private route: ActivatedRoute, private router: Router,
              private fb: FormBuilder, private permissionService: PermissionService,
              private genericService: GenericService, public userSession: UserSessionService,
              private selectService: SelectService, private notificationService: NotificationService,
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
          const index = this.formGroup.get('modules').value.findIndex(groupModule => groupModule.name === module.name);
          if (!isNaN(index)) {
            (this.formGroup.get('modules') as FormArray).at(index).patchValue(module);
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

      (this.formGroup.get('modules') as FormArray).push(group);
    });
  }

  checkAll(checked: boolean): void {
    (this.formGroup.get('modules') as FormArray).controls.forEach((group: FormGroup) => {
      group.get('all').patchValue(checked);
      this.checkRow(checked, group);
    })
  }

  checkRow(checked: boolean, group: FormGroup): void {
    PermissionActions.forEach(action => {
      group.get(action).patchValue(checked);
    });
  }

  actionChecked(checked: boolean, group: FormGroup): void {
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

  confirmDeletePermission(): void {
    if (this.permission.userCount > 0) {
      this.reassignPermission();
      return;
    }

    this.notificationService.warning().then(confirmation => {
      if (confirmation.value) {
        this.deletePermission();
      }
    });
  }

  private reassignPermission(): void {
    this.selectService.select('permission').then(permissions => {
      permissions = permissions.filter(permission => permission.id !== this.permission.id);

      if (permissions.length === 0) {
        const msg = this.t.transform('create_delete_permission_s');
        this.notificationService.error(msg);
        return;
      }

      const dialog = this.dialog.open(ReassignDialogComponent, {
        data: { permissions, userCount: this.permission.userCount },
        width: '500px',
        panelClass: 'no-overflow'
      });

      this.sub.add(dialog.afterClosed().subscribe(newPermissionId => {
        if (newPermissionId) {
          this.deletePermission(newPermissionId);
        }
      }));
    });
  }

  private deletePermission(newPermissionId?): void {
    this.permissionService.deletePermission(this.permission.id, newPermissionId).then(response => {
      if (response) {
        this.notificationService.success();
        this.router.navigate(['/platform', 'settings', 'permissions']);
      }
    });
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
      this.router.navigate(['/platform', 'settings', 'permissions']);
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

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
