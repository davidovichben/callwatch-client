import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { TranslateModule } from 'src/app/_shared/pipes/translate/translate.module';

import { FormComponent } from './form.component';

import { KeywordService } from 'src/app/_shared/services/http/keyword.service';

import { KeywordResolve } from 'src/app/_shared/resolves/keyword.resolve';

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
    canDeactivate: [DeactivateGuard],
		resolve: {
			keyword: KeywordResolve
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
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    TranslateModule
  ],
	providers: [
		KeywordService,
		KeywordResolve,
    DeactivateGuard
  ]
})
export class FormModule {}
