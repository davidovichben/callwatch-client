import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { TranslateModule } from 'src/app/_shared/pipes/translate/translate.module';
import { SelectGroupsModule } from 'src/app/_shared/components/select-groups/select-groups.module';

import { FormComponent } from './form.component';

import { ReportSetService } from 'src/app/_shared/services/http/report-set.service';
import { ReportService } from 'src/app/_shared/services/http/report.service';

import { ReportSetResolve } from 'src/app/_shared/resolves/report-set.resolve';
import { ReportSelectResolve } from 'src/app/_shared/resolves/report-select.resolve';

const routes: Routes = [
  {
    path: '',
    component: FormComponent,
    resolve: {
      reports: ReportSelectResolve
    }
  },
  {
    path: ':id',
    component: FormComponent,
    resolve: {
      reportSet: ReportSetResolve,
      reports: ReportSelectResolve
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
    ReportSetResolve,
    ReportSelectResolve
  ]
})
export class FormModule {}
