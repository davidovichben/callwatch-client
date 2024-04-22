import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';

import { TranslateModule } from 'src/app/_shared/pipes/translate/translate.module';
import { DatePickerModule } from 'src/app/_shared/components/date-picker/date-picker.module';

import { FormComponent } from 'src/app/platform/settings/unique-days/form/form.component';

import { UniqueDayService } from 'src/app/_shared/services/http/unique-day.service';

import { UniqueDayResolve } from 'src/app/_shared/resolves/unique-day.resolve';

import { DeactivateGuard } from 'src/app/_shared/guards/deactivate.guard';

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
    MatCheckboxModule,
    TranslateModule,
    DatePickerModule
  ],
	providers: [UniqueDayService, UniqueDayResolve, DeactivateGuard]
})
export class FormModule {}
