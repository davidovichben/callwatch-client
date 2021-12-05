import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';

import { TranslateModule } from 'src/app/_shared/pipes/translate/translate.module';
import { AudioInputModule } from 'src/app/_shared/components/audio-input/audio-input.module';

import { FormComponent } from './form.component';

import { RouterService } from 'src/app/_shared/services/http/router.service';
import { GenericService } from 'src/app/_shared/services/http/generic.service';

import { RouterResolve } from 'src/app/_shared/resolves/router.resolve';
import { ScheduleSelectResolve } from 'src/app/_shared/resolves/schedule-select.resolve';

const routes: Routes = [
	{
		path: '',
		component: FormComponent,
    resolve: {
      schedules: ScheduleSelectResolve
    }
	},
	{
		path: ':id',
		component: FormComponent,
		resolve: {
      router: RouterResolve,
      schedules: ScheduleSelectResolve
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
    MatButtonModule,
    MatCheckboxModule,
    MatDatepickerModule,
    TranslateModule,
    AudioInputModule
  ],
	providers: [
    RouterService,
    GenericService,
    RouterResolve,
    ScheduleSelectResolve
  ]
})
export class FormModule {}
