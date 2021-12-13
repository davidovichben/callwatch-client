import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { TranslateModule } from 'src/app/_shared/pipes/translate/translate.module';
import { SelectGroupsModule } from 'src/app/_shared/components/select-groups/select-groups.module';
import { UnitSelectModule } from 'src/app/_shared/components/unit-select/unit-select.module';

import { FormComponent } from './form.component';

import { AcdService } from 'src/app/_shared/services/http/acd.service';

import { AcdResolve } from 'src/app/_shared/resolves/acd.resolve';
import { AcdFormSelectResolve } from 'src/app/_shared/resolves/acd-form-select.resolve';

const routes: Routes = [
	{
		path: '',
		component: FormComponent,
    resolve: {
      selects: AcdFormSelectResolve
    }
  },
	{
		path: ':id',
		component: FormComponent,
		resolve: {
      acd: AcdResolve,
      selects: AcdFormSelectResolve
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
    MatCheckboxModule,
    TranslateModule,
    UnitSelectModule,
    SelectGroupsModule
  ],
	providers: [
    AcdService,
    AcdResolve,
    AcdFormSelectResolve
  ]
})
export class FormModule {}
