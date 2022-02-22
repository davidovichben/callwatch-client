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
import { UnitSelectModule } from 'src/app/_shared/components/unit-select/unit-select.module';

import { HistoricalComponent } from './historical.component';
import { ResultsComponent } from './results/results.component';
import { ProductionComponent } from './production/production.component';

import { ReportTemplateService } from 'src/app/_shared/services/http/report-template.service';
import { SelectService } from 'src/app/_shared/services/http/select.service';
import { UnitService } from 'src/app/_shared/services/http/unit.service';

import { ReportModulesSelectResolve } from 'src/app/_shared/resolves/report-modules-select.resolve';
import { UnitsSelectResolve } from 'src/app/_shared/resolves/units-select.resolve';

const routes: Routes = [
  {
    path: '',
    component: HistoricalComponent,
    resolve: {
      modules: ReportModulesSelectResolve,
      units: UnitsSelectResolve
    }
  }
];

@NgModule({
  declarations: [HistoricalComponent, ProductionComponent, ResultsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    TranslateModule,
    UnitSelectModule
  ],
  providers: [
    ReportTemplateService,
    SelectService,
    UnitService,
    ReportModulesSelectResolve,
    UnitsSelectResolve
  ]
})
export class HistoricalModule {}
