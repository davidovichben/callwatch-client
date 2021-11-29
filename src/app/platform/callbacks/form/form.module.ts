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

import { FormComponent } from './form.component';

import { CallbackService } from 'src/app/_shared/services/http/callback.service';
import { ScheduleService } from 'src/app/_shared/services/http/schedule.service';

import { CallbackResolve } from 'src/app/_shared/resolves/callback.resolve';
import { ScheduleSelectResolve } from 'src/app/_shared/resolves/schedule-select.resolve';

const routes: Routes = [
	{
		path: '',
		component: FormComponent,
    resolve: { schedules: ScheduleSelectResolve }
	},
	{
		path: ':id',
		component: FormComponent,
		resolve: { callback: CallbackResolve, schedules: ScheduleSelectResolve }
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
	providers: [CallbackService, CallbackResolve, ScheduleService, ScheduleSelectResolve]
})
export class FormModule {}
