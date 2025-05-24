import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { TranslateModule } from 'src/app/_shared/pipes/translate/translate.module';
import { UnitSelectModule } from 'src/app/_shared/components/unit-select/unit-select.module';

import { FormComponent } from 'src/app/platform/settings/mail-servers/form/form.component';

import { MailServerService } from 'src/app/_shared/services/http/mail-server.service';
import { SelectService } from 'src/app/_shared/services/http/select.service';
import { NotificationService } from 'src/app/_shared/services/generic/notification.service';

import { MailServerResolve } from 'src/app/_shared/resolves/mail-server.resolve';

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
			mailServer: MailServerResolve
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
    MatIconModule,
    MatTooltipModule,
    TranslateModule,
    UnitSelectModule
  ],
	providers: [
    MailServerService,
    SelectService,
    NotificationService,
		MailServerResolve,
    DeactivateGuard
  ]
})
export class FormModule {}
