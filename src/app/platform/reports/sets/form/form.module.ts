import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { TranslateModule } from 'src/app/_shared/pipes/translate/translate.module';
import { DualGroupsSelectModule } from 'src/app/_shared/components/dual-groups-select/dual-groups-select.module';

import { FormComponent } from './form.component';

import { ReportSetService } from 'src/app/_shared/services/http/report-set.service';
import { SelectService } from 'src/app/_shared/services/http/select.service';
import { UnitService } from 'src/app/_shared/services/http/unit.service';

import { ReportSetResolve } from 'src/app/_shared/resolves/report-set.resolve';
import { ReportSelectResolve } from 'src/app/_shared/resolves/report-select.resolve';
import { UnitsResolve } from 'src/app/_shared/resolves/units.resolve';

const routes: Routes = [
  {
    path: '',
    component: FormComponent,
    resolve: {
      reports: ReportSelectResolve,
      units: UnitsResolve
    }
  },
  {
    path: ':id',
    component: FormComponent,
    resolve: {
      reportSet: ReportSetResolve,
      reports: ReportSelectResolve,
      units: UnitsResolve
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
		DualGroupsSelectModule
	],
  providers: [
    ReportSetService,
    SelectService,
    UnitService,
    ReportSetResolve,
    ReportSelectResolve,
    UnitsResolve
  ]
})
export class FormModule {}
