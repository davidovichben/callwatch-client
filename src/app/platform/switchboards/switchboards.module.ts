import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DataTableModule } from 'src/app/_shared/components/data-table/data-table.module';
import { TranslateModule } from 'src/app/_shared/pipes/translate/translate.module';

import { SwitchboardsComponent } from './switchboards.component';

import { SwitchboardService } from 'src/app/_shared/services/http/switchboard.service';

const routes: Routes = [
	{ path: '', component: SwitchboardsComponent },
	{ path: 'form', loadChildren: () => import('./form/form.module').then(m => m.FormModule) }
];

@NgModule({
	declarations: [SwitchboardsComponent],
	imports: [
		RouterModule.forChild(routes),
		DataTableModule,
    TranslateModule
	],
	providers: [SwitchboardService]
})
export class SwitchboardsModule {}
