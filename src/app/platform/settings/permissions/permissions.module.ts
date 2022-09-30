import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DataTableModule } from 'src/app/_shared/components/data-table/data-table.module';
import { TranslateModule } from 'src/app/_shared/pipes/translate/translate.module';
import { ReassignDialogModule } from 'src/app/platform/settings/permissions/reassign-dialog/reassign-dialog.module';

import { PermissionsComponent } from 'src/app/platform/settings/permissions/permissions.component';

import { PermissionService } from 'src/app/_shared/services/http/permission.service';
import { SelectService } from 'src/app/_shared/services/http/select.service';

import { TranslatePipe } from 'src/app/_shared/pipes/translate/translate.pipe';

const routes: Routes = [
  { path: '', component: PermissionsComponent },
  {
    path: 'form',
    loadChildren: () => import('src/app/platform/settings/permissions/form/form.module').then(m => m.FormModule),
  }
];

@NgModule({
  declarations: [PermissionsComponent],
	imports: [
    RouterModule.forChild(routes),
    TranslateModule,
		DataTableModule,
    ReassignDialogModule
	],
  providers: [
    PermissionService,
    SelectService,
    TranslatePipe
  ]
})
export class PermissionsModule {}
