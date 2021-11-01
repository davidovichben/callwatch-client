import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { TranslateModule } from 'src/app/_shared/pipes/translate/translate.module';

import { FormComponent } from 'src/app/platform/reports/form/form.component';

import { ReportService } from 'src/app/_shared/services/http/report.service';

import { ReportResolve } from 'src/app/_shared/resolves/report.resolve';

const routes: Routes = [
  { path: '', component: FormComponent },
  {
    path: ':id',
    component: FormComponent,
    resolve: { report: ReportResolve }
  }
];

@NgModule({
  declarations: [FormComponent],
  imports: [
    FormsModule,
    RouterModule.forChild(routes),
    MatFormFieldModule,
    MatInputModule,
    TranslateModule
  ],
  providers: [ReportService, ReportResolve]
})
export class FormModule {}
