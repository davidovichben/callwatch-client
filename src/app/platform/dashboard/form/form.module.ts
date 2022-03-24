import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { TranslateModule } from 'src/app/_shared/pipes/translate/translate.module';
import { WidgetFormModule } from './widget-form/widget-form.module';

import { FormComponent } from './form.component';

import { ReportWidgetService } from 'src/app/_shared/services/http/report-widget.service';
import { SelectService } from 'src/app/_shared/services/http/select.service';

import { ReportModulesSelectResolve } from 'src/app/_shared/resolves/report-modules-select.resolve';

const routes: Routes = [
  {
    path: '',
    component: FormComponent,
    resolve: {
      reportModules: ReportModulesSelectResolve
    }
  }
];

@NgModule({
  declarations: [FormComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatDialogModule,
    DragDropModule,
    TranslateModule,
    WidgetFormModule
  ],
  providers: [ReportWidgetService, SelectService, ReportModulesSelectResolve]
})
export class FormModule {}
