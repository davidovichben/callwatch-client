import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { UnitSelectModule } from 'src/app/_shared/components/unit-select/unit-select.module';
import { TranslateModule } from 'src/app/_shared/pipes/translate/translate.module';
import { DatePickerModule } from 'src/app/_shared/components/date-picker/date-picker.module';

import { CriteriaComponent } from './criteria.component';

import { UnitService } from 'src/app/_shared/services/http/unit.service';

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
    DatePickerModule
  ],
  providers: [UnitService, UnitsSelectResolve]
})
export class CriteriaModule {}
