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

const routes: Routes = [
	{
		path: '',
		component: FormComponent
	},
	{
		path: ':id',
		component: FormComponent,
		resolve: {
      uniqueDay: UniqueDayResolve
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
    MatDatepickerModule,
    TranslateModule,
    MatCheckboxModule
  ],
	providers: [UniqueDayService, UniqueDayResolve]
})
export class FormModule {}
