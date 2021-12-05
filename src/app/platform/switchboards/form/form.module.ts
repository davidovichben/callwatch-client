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

import { TranslateModule } from 'src/app/_shared/pipes/translate/translate.module';

import { FormComponent } from './form.component';

import { SwitchboardService } from 'src/app/_shared/services/http/switchboard.service';

import { SwitchboardResolve } from 'src/app/_shared/resolves/switchboard.resolve';

const routes: Routes = [
	{
		path: '',
		component: FormComponent
	},
	{
		path: ':id',
		component: FormComponent,
		resolve: {
			switchboard: SwitchboardResolve
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
    MatIconModule,
    TranslateModule
  ],
	providers: [SwitchboardService, SwitchboardResolve]
})
export class FormModule {}
