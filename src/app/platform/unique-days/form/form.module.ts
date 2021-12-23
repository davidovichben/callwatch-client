import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { TranslateModule } from 'src/app/_shared/pipes/translate/translate.module';

import { FormComponent } from './form.component';

import { UniqueDayService } from 'src/app/_shared/services/http/unique-day.service';

import { UniqueDayResolve } from 'src/app/_shared/resolves/unique-day.resolve';

import { DeactivateGuard } from 'src/app/_shared/guards/deactivate.guard';
import { TimeInputModule } from 'src/app/_shared/components/time-input/time-input.module';

const routes: Routes = [
	{
		path: '',
		component: FormComponent,
    canDeactivate: [DeactivateGuard]
  },
	{
		path: ':id',
		component: FormComponent,
		resolve: {
      uniqueDay: UniqueDayResolve
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
    MatDatepickerModule,
    TranslateModule,
    MatCheckboxModule,
    TimeInputModule
  ],
	providers: [UniqueDayService, UniqueDayResolve, DeactivateGuard]
})
export class FormModule {}
