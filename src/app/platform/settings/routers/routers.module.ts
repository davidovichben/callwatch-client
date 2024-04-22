import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';

import { DataTableModule } from 'src/app/_shared/components/data-table/data-table.module';
import { TranslateModule } from 'src/app/_shared/pipes/translate/translate.module';
import { ChipsInputModule } from 'src/app/_shared/components/chips-input/chips-input.module';

import { RoutersComponent } from 'src/app/platform/settings/routers/routers.component';
import { DuplicationDialogComponent } from './duplication-dialog/duplication-dialog.component';

import { RouterService } from 'src/app/_shared/services/http/router.service';
import { GenericService } from 'src/app/_shared/services/http/generic.service';

const routes: Routes = [
	{
		path: '',
		component: RoutersComponent
	},
	{ path: 'form', loadChildren: () => import('src/app/platform/settings/routers/form/form.module').then(m => m.FormModule) }
];

@NgModule({
    declarations: [RoutersComponent, DuplicationDialogComponent],
    imports: [
        RouterModule.forChild(routes),
        ReactiveFormsModule,
        MatDialogModule,
        DataTableModule,
        TranslateModule,
        ChipsInputModule
    ],
    exports: [
        RoutersComponent
    ],
    providers: [RouterService, GenericService]
})
export class RoutersModule {}
