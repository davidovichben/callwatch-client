import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { PermissionService } from 'src/app/_shared/services/http/permission.service';
import { GenericService } from 'src/app/_shared/services/http/generic.service';

import { ErrorMessages } from 'src/app/_shared/constants/error-messages';
import { PermissionActions, PermissionModules } from 'src/app/_shared/models/permission.model';
import { PermissionModuleModel } from 'src/app/_shared/models/permission-module.model';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.styl']
})
export class FormComponent implements OnInit {

  readonly sub = new Subscription();
  readonly errorMessages = ErrorMessages;
  readonly actions =  PermissionActions;

  permissionId: number;

  formGroup: FormGroup;

  isSubmitting = false;

  constructor(private route: ActivatedRoute, private router: Router,
              private fb: FormBuilder, private permissionService: PermissionService,
              private genericService: GenericService) {}

  ngOnInit(): void {
    this.makeForm();
    this.setModules();

    const routeData = this.route.snapshot.data.permission;
    if (routeData) {
      this.permissionId = routeData.id;
      this.formGroup.patchValue(routeData);
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
      console.log(module)

      const group = this.fb.group({
        name: this.fb.control(module),
        all: this.fb.control(false),
        read: this.fb.control(false),
        create: this.fb.control(false),
        update: this.fb.control(false),
        delete: this.fb.control(false),
      });

      (this.formGroup.get('modules') as FormArray).push(group);
      this.setFormSubscriptions(group);
    });
  }

  private setFormSubscriptions(group: FormGroup): void {
    this.sub.add(group.get('all').valueChanges.subscribe(checked =>
      PermissionActions.forEach(action => {
        const control = group.get(action);

        control.patchValue(checked);
        checked ? control.disable() : control.enable();
      })
    ));

    PermissionActions.forEach(action => {
      const control = group.get(action);
      const read = group.get('read');
      this.sub.add(control.valueChanges.subscribe(checked => {
        read.patchValue(checked);
        checked ? read.disable() : read.enable();
      }))
    })
  }

  checkAll(checked: boolean): void {
    (this.formGroup.get('modules') as FormArray).controls.forEach(group => {
      group.get('all').patchValue(checked);
    })
  }

  submit(): void {
    if (this.formGroup.valid && !this.isSubmitting) {
      this.isSubmitting = true;

      if (this.permissionId) {
        this.permissionService.updatePermission(this.permissionId, this.formGroup.value).then(response => {
          this.handleSubmitResponse(response);
        })
      } else {
        this.permissionService.newPermission(this.formGroup.value).then(response => {
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
    return this.genericService.exists('permission', control.value).then(response => {
      if (response) {
        return response.exists ? { exists: true } : null;
      }

      return null;
    })
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
