import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { TranslateModule } from 'src/app/_shared/pipes/translate/translate.module';
import { DualGroupsSelectModule } from 'src/app/_shared/components/dual-groups-select/dual-groups-select.module';
import { UnitSelectModule } from 'src/app/_shared/components/unit-select/unit-select.module';
import { CriteriaModule } from './criteria/criteria.module';

import { FormComponent } from './form.component';

import { ReportTimingService } from 'src/app/_shared/services/http/report-timing.service';
import { ReportTemplateService } from 'src/app/_shared/services/http/report-template.service';
import { UnitService } from 'src/app/_shared/services/http/unit.service';
import { SelectService } from 'src/app/_shared/services/http/select.service';

import { ReportTimingResolve } from 'src/app/_shared/resolves/report-timing.resolve';
import { ReportTemplateSelectResolve } from 'src/app/_shared/resolves/report-template-select.resolve';
import { UserSelectResolve } from 'src/app/_shared/resolves/user-select.resolve';
import { UnitsSelectResolve } from 'src/app/_shared/resolves/units-select.resolve';

const routes: Routes = [
  {
    path: '',
    component: FormComponent,
    resolve: {
      reportTemplates: ReportTemplateSelectResolve,
      users: UserSelectResolve,
      units: UnitsSelectResolve
    }
  },
  {
    path: ':id',
    component: FormComponent,
    resolve: {
      reportTiming: ReportTimingResolve,
      reportTemplates: ReportTemplateSelectResolve,
      users: UserSelectResolve,
      units: UnitsSelectResolve
    }
  }
];

@NgModule({
  declarations: [FormComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    TranslateModule,
    DualGroupsSelectModule,
    CriteriaModule,
    MatCheckboxModule,
    UnitSelectModule
  ],
  providers: [
    ReportTemplateService,
    ReportTimingService,
    UnitService,
    SelectService,
    ReportTimingResolve,
    ReportTemplateSelectResolve,
    UserSelectResolve,
    UnitsSelectResolve
  ]
})
export class FormModule {}
