import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';

import { TranslateModule } from 'src/app/_shared/pipes/translate/translate.module';
import { UnitSelectModule } from 'src/app/_shared/components/unit-select/unit-select.module';

import { FormComponent } from 'src/app/platform/settings/mailboxes/form/form.component';

import { MailServerService } from 'src/app/_shared/services/http/mail-server.service';
import { UnitService } from 'src/app/_shared/services/http/unit.service';

import { MailboxResolve } from 'src/app/_shared/resolves/mailbox.resolve';
import { MailServerSelectResolve } from 'src/app/_shared/resolves/mail-server-select.resolve';
import { UnitsResolve } from 'src/app/_shared/resolves/units.resolve';

import { DeactivateGuard } from 'src/app/_shared/guards/deactivate.guard';

const routes: Routes = [
  {
    path: '',
    component: FormComponent,
    resolve: {
      mailServers: MailServerSelectResolve,
	    units: UnitsResolve
    },
    canDeactivate: [DeactivateGuard]
  },
  {
    path: ':id',
    component: FormComponent,
    resolve: {
      mailbox: MailboxResolve,
	    units: UnitsResolve,
	    mailServers: MailServerSelectResolve
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
		TranslateModule,
		UnitSelectModule,
	],
  providers: [
    MailServerService,
    MailServerSelectResolve,
    MailboxResolve,
    DeactivateGuard,
	  UnitService,
	  UnitsResolve
  ]
})
export class FormModule {}
