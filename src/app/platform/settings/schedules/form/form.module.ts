import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { MatLegacySlideToggleModule as MatSlideToggleModule } from '@angular/material/legacy-slide-toggle';
import { MatIconModule } from '@angular/material/icon';

import { TranslateModule } from 'src/app/_shared/pipes/translate/translate.module';
import { BdSelectModule } from 'src/app/_shared/components/bd-select/bd-select.module';
import { TagsInputModule } from 'src/app/_shared/components/tags-input/tags-input.module';

import { FormComponent } from 'src/app/platform/settings/schedules/form/form.component';

import { ScheduleService } from 'src/app/_shared/services/http/schedule.service';
import { SelectService } from 'src/app/_shared/services/http/select.service';
import { UniqueDayService } from 'src/app/_shared/services/http/unique-day.service';

import { ScheduleResolve } from 'src/app/_shared/resolves/schedule.resolve';
import { UniqueDaySelectResolve } from 'src/app/_shared/resolves/unique-day-select.resolve';

import { TranslatePipe } from 'src/app/_shared/pipes/translate/translate.pipe';
import { UniqueScheduleSelectResolve } from 'src/app/_shared/resolves/unique-schedules-select.resolve';

import { DeactivateGuard } from 'src/app/_shared/guards/deactivate.guard';

const routes: Routes = [
  {
    path: '',
    component: FormComponent,
    resolve: {
      uniqueDays: UniqueDaySelectResolve,
      uniqueSchedules: UniqueScheduleSelectResolve
    },
    canDeactivate: [DeactivateGuard]
  },
  {
    path: ':id',
    component: FormComponent,
    resolve: {
      schedule: ScheduleResolve,
      uniqueDays: UniqueDaySelectResolve,
      uniqueSchedules: UniqueScheduleSelectResolve
    },
    canDeactivate: [DeactivateGuard]
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
    TagsInputModule
  ],
  providers: [
    ScheduleService,
    SelectService,
    UniqueDayService,
    ScheduleResolve,
    UniqueDaySelectResolve,
    UniqueScheduleSelectResolve,
    TranslatePipe,
    DeactivateGuard
  ]
})
export class FormModule {}
