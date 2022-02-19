import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { AudioInputModule } from 'src/app/_shared/components/audio-input/audio-input.module';
import { NumberInputModule } from 'src/app/_shared/components/number-input/number-input.module';

import { TranslateModule } from 'src/app/_shared/pipes/translate/translate.module';

import { FormComponent } from 'src/app/platform/settings/callbacks/form/form.component';

import { CallbackService } from 'src/app/_shared/services/http/callback.service';
import { SelectService } from 'src/app/_shared/services/http/select.service';

import { CallbackResolve } from 'src/app/_shared/resolves/callback.resolve';
import { ScheduleSelectResolve } from 'src/app/_shared/resolves/schedule-select.resolve';

import { DeactivateGuard } from 'src/app/_shared/guards/deactivate.guard';

const routes: Routes = [
	{
		path: '',
		component: FormComponent,
    resolve: {
      schedules: ScheduleSelectResolve
    },
    canDeactivate: [DeactivateGuard]
  },
	{
		path: ':id',
		component: FormComponent,
		resolve: {
      callback: CallbackResolve,
      schedules: ScheduleSelectResolve
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
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    TranslateModule,
    NumberInputModule,
    AudioInputModule
  ],
	providers: [
    CallbackService,
    SelectService,
    CallbackResolve,
    ScheduleSelectResolve,
    DeactivateGuard
  ]
})
export class FormModule {}
