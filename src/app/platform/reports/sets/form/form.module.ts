import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SelectGroupsModule } from 'src/app/_shared/components/select-groups/select-groups.module';

import { TranslateModule } from 'src/app/_shared/pipes/translate/translate.module';

import { FormComponent } from './form.component';

import { ReportSetService } from 'src/app/_shared/services/http/report-set.service';
import { ReportService } from 'src/app/_shared/services/http/report.service';
import { PermissionEntityService } from 'src/app/_shared/services/http/permission-entity.service';

import { ReportSetResolve } from 'src/app/_shared/resolves/report-set.resolve';
import { ReportSelectResolve } from 'src/app/_shared/resolves/report-select.resolve';
import { PermissionEntitySelectResolve } from 'src/app/_shared/resolves/permission-entity-select.resolve';

const routes: Routes = [
  {
    path: '',
    component: FormComponent,
    resolve: {
      reports: ReportSelectResolve,
      permissionEntities: PermissionEntitySelectResolve
    }
  },
  {
    path: ':id',
    component: FormComponent,
    resolve: {
      reportSet: ReportSetResolve,
      reports: ReportSelectResolve,
      permissionEntities: PermissionEntitySelectResolve
    }
  }
];

@NgModule({
  declarations: [FormComponent],
  imports: [
    RouterModule.forChild(routes),
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    TranslateModule,
    SelectGroupsModule
  ],
  providers: [
    ReportSetService,
    ReportService,
    PermissionEntityService,
    ReportSetResolve,
    ReportSelectResolve,
    PermissionEntitySelectResolve
  ]
})
export class FormModule {}
