import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';

import { DataTableModule } from 'src/app/_shared/components/data-table/data-table.module';
import { TranslateModule } from 'src/app/_shared/pipes/translate/translate.module';
import { MultipleEditModule } from './multiple-edit/multiple-edit.module';

import { CallbacksComponent } from 'src/app/platform/settings/callbacks/callbacks.component';

import { CallbackService } from 'src/app/_shared/services/http/callback.service';

const routes: Routes = [
	{
		path: '',
		component: CallbacksComponent
	},
	{ path: 'form', loadChildren: () => import('src/app/platform/settings/callbacks/form/form.module').then(m => m.FormModule) }
];

@NgModule({
	declarations: [CallbacksComponent],
	imports: [
		RouterModule.forChild(routes),
		DataTableModule,
    MatDialogModule,
    TranslateModule,
    MultipleEditModule
	],
	providers: [CallbackService]
})
export class CallbacksModule {}
