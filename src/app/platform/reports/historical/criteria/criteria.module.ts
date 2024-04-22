import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyRadioModule as MatRadioModule } from '@angular/material/legacy-radio';

import { UnitSelectModule } from 'src/app/_shared/components/unit-select/unit-select.module';
import { TranslateModule } from 'src/app/_shared/pipes/translate/translate.module';
import { DateRangePickerModule } from 'src/app/_shared/components/date-range-picker/date-range-picker.module';

import { CriteriaComponent } from './criteria.component';

import { UnitService } from 'src/app/_shared/services/http/unit.service';
import { ReportCriteriaService } from 'src/app/_shared/services/http/report-criteria.service';

import { UnitsSelectResolve } from 'src/app/_shared/resolves/units-select.resolve';

const routes: Routes = [
  {
    path: '',
    component: CriteriaComponent,
    resolve: {
      units: UnitsSelectResolve
    }
  }
];

@NgModule({
  declarations: [CriteriaComponent],
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
		UnitSelectModule,
		TranslateModule,
		DateRangePickerModule,
		MatRadioModule
	],
  providers: [UnitService, UnitsSelectResolve, ReportCriteriaService]
})
export class CriteriaModule {}
