import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DataTableModule } from 'src/app/_shared/components/data-table/data-table.module';
import { TranslateModule } from 'src/app/_shared/pipes/translate/translate.module';
import { MatDialogModule } from '@angular/material/dialog';
import { MultipleEditModule } from 'src/app/platform/settings/acds/multiple-edit/multiple-edit.module';

import { AcdsComponent } from 'src/app/platform/settings/acds/acds.component';

import { AcdService } from 'src/app/_shared/services/http/acd.service';
import { SelectService } from 'src/app/_shared/services/http/select.service';

import { AcdFormSelectResolve } from 'src/app/_shared/resolves/acd-form-select.resolve';

const routes: Routes = [
	{
		path: '',
		component: AcdsComponent,
    resolve: { selects: AcdFormSelectResolve }
	},
	{ path: 'form', loadChildren: () => import('./form/form.module').then(m => m.FormModule) }
];

@NgModule({
	declarations: [AcdsComponent],
	imports: [
		RouterModule.forChild(routes),
		DataTableModule,
    TranslateModule,
    MatDialogModule,
    MultipleEditModule
	],
	providers: [AcdService, AcdFormSelectResolve, SelectService]
})
export class AcdsModule {}
