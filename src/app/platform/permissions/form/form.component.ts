import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';

import { PermissionService } from 'src/app/_shared/services/http/permission.service';

import { ErrorMessages } from 'src/app/_shared/constants/error-messages';
import { PermissionModel, PermissionActions } from 'src/app/_shared/models/permission.model';
import { PlatformModules } from 'src/app/_shared/constants/general';
import { ModuleModel } from 'src/app/_shared/models/module.model';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html'
})
export class FormComponent implements OnInit {

  readonly errorMessages = ErrorMessages;
  readonly actions =  PermissionActions;

  permission: PermissionModel;

  modules: ModuleModel[] = [];

  constructor(private route: ActivatedRoute,
              private router: Router,
              private permissionService: PermissionService) {}

  ngOnInit(): void {
    this.loadModules();

    this.permission = this.route.snapshot.data.permission;
    if (this.permission) {
      this.permission.modules.forEach(module => this.loadModule(module));
    } else {
      this.permission = new PermissionModel();
    }
  }

  private loadModules(): void {
    PlatformModules.forEach(module => {
      if (module.subModules && !module.isGuarded) {
        module.subModules.forEach(subModule => {
          this.modules.push({ name: subModule.name });
        });
      } else if (module.isGuarded) {
        this.modules.push({ name: module.name });
      }
    });
  }

  private loadModule(module: ModuleModel): void {
    const match = this.modules.find(iteratedModule => iteratedModule.name === module.name);
    if (match) {
      match.checked = true;
      this.actions.forEach(scope => {
        match[scope] = module[scope];
        if (!module[scope]) {
          match.checked = false;
        }
      });
    }
  }

  checkRow(module: ModuleModel): void {
    this.actions.forEach(scope => module[scope] = module.checked);
  }

  checkAll(isChecked: boolean): void {
    this.modules.forEach(module => {
      module.checked = isChecked;
      this.checkRow(module)
    });
  }

  submit(form: NgForm): void {
    if (form.valid) {
      const modules = this.modules.filter(module => {
        return this.actions.some(scope => {
          return !!module[scope];
        });
      });

      const values = { name: form.value.name, modules };

      if (this.permission.id) {
        this.permissionService.updatePermission(this.permission.id, values).then(response => {
          this.handleSubmitResponse(response);
        })
      } else {
        this.permissionService.newPermission(values).then(response => {
          this.handleSubmitResponse(response);
        })
      }
    }
  }

  private handleSubmitResponse(response: boolean): void  {
    if (response) {
      this.router.navigate(['/platform', 'permissions']);
    }
  }
}
