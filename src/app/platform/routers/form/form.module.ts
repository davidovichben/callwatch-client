import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';

import { TranslateModule } from 'src/app/_shared/pipes/translate/translate.module';
import { GeneralModule } from 'src/app/platform/routers/form/general/general.module';
import { MessagesModule } from './messages/messages.module';
import { KeysModule } from 'src/app/platform/routers/form/keys/keys.module';

import { FormComponent } from './form.component';

import { RouterService } from 'src/app/_shared/services/http/router.service';
import { GenericService } from 'src/app/_shared/services/http/generic.service';
import { RouterFormService } from 'src/app/_shared/services/state/router-form.service';

import { RouterResolve } from 'src/app/_shared/resolves/router.resolve';
import { ScheduleSelectResolve } from 'src/app/_shared/resolves/schedule-select.resolve';
import { RouterActivityTypeResolve } from 'src/app/_shared/resolves/router-activity-type.resolve';
import { AcdSelectResolve } from 'src/app/_shared/resolves/acd-select.resolve';
import { RouterSelectResolve } from 'src/app/_shared/resolves/router-select.resolve';

const routes: Routes = [
	{
		path: '',
		component: FormComponent,
    resolve: {
      keyActivityTypes: RouterActivityTypeResolve,
      schedules: ScheduleSelectResolve,
      acds: AcdSelectResolve,
      routers: RouterSelectResolve
    }
	},
	{
		path: ':id',
		component: FormComponent,
		resolve: {
      router: RouterResolve,
      keyActivityTypes: RouterActivityTypeResolve,
      schedules: ScheduleSelectResolve,
      acds: AcdSelectResolve,
      routers: RouterSelectResolve
    }
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
    GeneralModule,
		MessagesModule,
		KeysModule
	],
	providers: [
    RouterService,
    GenericService,
    RouterFormService,
    RouterResolve,
    ScheduleSelectResolve,
    RouterActivityTypeResolve,
    AcdSelectResolve,
    RouterSelectResolve
  ]
})
export class FormModule {}
