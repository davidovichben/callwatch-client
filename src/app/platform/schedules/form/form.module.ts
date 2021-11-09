import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';

import { TranslateModule } from 'src/app/_shared/pipes/translate/translate.module';
import { BdSelectModule } from 'src/app/_shared/components/bd-select/bd-select.module';
import { TimeInputModule } from 'src/app/_shared/components/time-input/time-input.module';

import { FormComponent } from './form.component';

import { ScheduleService } from 'src/app/_shared/services/http/schedule.service';
import { UniqueDayService } from 'src/app/_shared/services/http/unique-day.service';

import { ScheduleResolve } from 'src/app/_shared/resolves/schedule.resolve';
import { UniqueDaySelectResolve } from 'src/app/_shared/resolves/unique-day-select.resolve';

import { TranslatePipe } from 'src/app/_shared/pipes/translate/translate.pipe';

const routes: Routes = [
  {
    path: '',
    component: FormComponent,
    resolve: { uniqueDays: UniqueDaySelectResolve }
  },
  {
    path: ':id',
    component: FormComponent,
    resolve: {
      schedule: ScheduleResolve, uniqueDays: UniqueDaySelectResolve
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
    MatCheckboxModule,
    MatSlideToggleModule,
    MatIconModule,
    TranslateModule,
    BdSelectModule,
    TimeInputModule
  ],
  providers: [
    ScheduleService,
    UniqueDayService,
    ScheduleResolve,
    UniqueDaySelectResolve,
    TranslatePipe
  ]
})
export class FormModule {}
