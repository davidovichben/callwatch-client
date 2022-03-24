import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';

import { TranslateModule } from 'src/app/_shared/pipes/translate/translate.module';
import { GeneralModule } from 'src/app/platform/settings/routers/form/general/general.module';
import { MessagesModule } from 'src/app/platform/settings/routers/form/messages/messages.module';
import { KeysModule } from 'src/app/platform/settings/routers/form/keys/keys.module';

import { FormComponent } from 'src/app/platform/settings/routers/form/form.component';

import { RouterService } from 'src/app/_shared/services/http/router.service';
import { SelectService } from 'src/app/_shared/services/http/select.service';
import { RouterFormService } from 'src/app/_shared/services/state/router-form.service';

import { RouterResolve } from 'src/app/_shared/resolves/router.resolve';
import { ScheduleSelectResolve } from 'src/app/_shared/resolves/schedule-select.resolve';
import { RouterActivityTypeResolve } from 'src/app/_shared/resolves/router-activity-type.resolve';
import { RouterSelectResolve } from 'src/app/_shared/resolves/router-select.resolve';
import { LanguageSelectResolve } from 'src/app/_shared/resolves/language-select.resolve';

import { DeactivateGuard } from 'src/app/_shared/guards/deactivate.guard';

const routes: Routes = [
	{
		path: '',
		component: FormComponent,
    resolve: {
      keyActivityTypes: RouterActivityTypeResolve,
      schedules: ScheduleSelectResolve,
      routers: RouterSelectResolve,
      languages: LanguageSelectResolve
    },
    canDeactivate: [DeactivateGuard]
	},
	{
		path: ':id',
		component: FormComponent,
		resolve: {
      router: RouterResolve,
      keyActivityTypes: RouterActivityTypeResolve,
      schedules: ScheduleSelectResolve,
      routers: RouterSelectResolve,
      languages: LanguageSelectResolve
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
		MatButtonModule,
		TranslateModule,
    GeneralModule,
		MessagesModule,
		KeysModule
	],
	providers: [
    RouterService,
    SelectService,
    RouterFormService,
    RouterResolve,
    ScheduleSelectResolve,
    RouterActivityTypeResolve,
    RouterSelectResolve,
    LanguageSelectResolve,
    DeactivateGuard
  ]
})
export class FormModule {}
