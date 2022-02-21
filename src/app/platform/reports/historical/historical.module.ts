import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';

import { TranslateModule } from 'src/app/_shared/pipes/translate/translate.module';

import { HistoricalComponent } from './historical.component';

import { ReportTemplateService } from 'src/app/_shared/services/http/report-template.service';
import { SelectService } from 'src/app/_shared/services/http/select.service';

import { ReportModulesSelectResolve } from 'src/app/_shared/resolves/report-modules-select.resolve';

const routes: Routes = [
  {
    path: '',
    component: HistoricalComponent,
    resolve: { modules: ReportModulesSelectResolve }
  }
];

@NgModule({
  declarations: [HistoricalComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    TranslateModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule
  ],
  providers: [
    ReportTemplateService,
    SelectService,
    ReportModulesSelectResolve
  ]
})
export class HistoricalModule {}
