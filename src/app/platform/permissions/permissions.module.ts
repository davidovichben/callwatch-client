import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

import { DataTableModule } from 'src/app/_shared/components/data-table/data-table.module';
import { TranslateModule } from 'src/app/_shared/pipes/translate/translate.module';

import { PermissionsComponent } from './permissions.component';

import { PermissionService } from 'src/app/_shared/services/http/permission.service';

const routes: Routes = [
  { path: '', component: PermissionsComponent },
  {
    path: 'form',
    loadChildren: () => import('./form/form.module').then(m => m.FormModule),
  }
];

@NgModule({
  declarations: [PermissionsComponent],
	imports: [
		CommonModule,
    RouterModule.forChild(routes),
    MatIconModule,
    TranslateModule,
		DataTableModule
	],
  providers: [PermissionService]
})
export class PermissionsModule {}
