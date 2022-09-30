import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';

import { TranslateModule } from 'src/app/_shared/pipes/translate/translate.module';

import { FormComponent } from 'src/app/platform/settings/routers/form/form.component';

import { RouterService } from 'src/app/_shared/services/http/router.service';
import { SelectService } from 'src/app/_shared/services/http/select.service';
import { RouterFormService } from 'src/app/_shared/services/state/router-form.service';

import { RouterResolve } from 'src/app/_shared/resolves/router.resolve';
import { RouterFormResolve } from 'src/app/_shared/resolves/router-form.resolve';

import { DeactivateGuard } from 'src/app/_shared/guards/deactivate.guard';

const routes: Routes = [
	{
		path: '',
		component: FormComponent,
    resolve: {
      selects: RouterFormResolve
    },
    canDeactivate: [DeactivateGuard],
    children: [
      { path: '', redirectTo: 'general', pathMatch: 'full' },
      { path: 'general', loadChildren: () => import('./general/general.module').then(m => m.GeneralModule) },
      { path: 'messages/:category', loadChildren: () => import('./messages/messages.module').then(m => m.MessagesModule) },
      { path: 'routing/:category', loadChildren: () => import('./keys/keys.module').then(m => m.KeysModule) }
    ]
	},
	{
		path: ':id',
    component: FormComponent,
    resolve: {
      selects: RouterFormResolve,
      router: RouterResolve
    },
    canDeactivate: [DeactivateGuard],
    children: [
      { path: '', redirectTo: 'general', pathMatch: 'full' },
      { path: 'general', loadChildren: () => import('./general/general.module').then(m => m.GeneralModule) },
      { path: 'messages/:category', loadChildren: () => import('./messages/messages.module').then(m => m.MessagesModule) },
      { path: 'routing/:category', loadChildren: () => import('./keys/keys.module').then(m => m.KeysModule) }
    ]
  }
];

@NgModule({
	declarations: [FormComponent],
	imports: [
		CommonModule,
		RouterModule.forChild(routes),
    ReactiveFormsModule,
		MatButtonModule,
		TranslateModule,
	],
	providers: [
    RouterService,
    SelectService,
    RouterFormService,
    RouterResolve,
    RouterFormResolve,
    DeactivateGuard
  ]
})
export class FormModule {}
