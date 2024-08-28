import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DataTableModule } from 'src/app/_shared/components/data-table/data-table.module';
import { TranslateModule } from 'src/app/_shared/pipes/translate/translate.module';
import { MatDialogModule } from '@angular/material/dialog';

import { MailServersComponent } from 'src/app/platform/settings/mail-servers/mail-servers.component';

import { MailServerService } from 'src/app/_shared/services/http/mail-server.service';

const routes: Routes = [
	{ path: '', component: MailServersComponent },
	{ path: 'form', loadChildren: () => import('src/app/platform/settings/mail-servers/form/form.module').then(m => m.FormModule) }
];

@NgModule({
	declarations: [MailServersComponent],
	imports: [
		RouterModule.forChild(routes),
		DataTableModule,
    TranslateModule,
    MatDialogModule
	],
	providers: [MailServerService]
})
export class MailServersModule {}
