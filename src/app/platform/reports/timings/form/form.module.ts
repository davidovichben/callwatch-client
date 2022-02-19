import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { TranslateModule } from 'src/app/_shared/pipes/translate/translate.module';
import { BdSelectModule } from 'src/app/_shared/components/bd-select/bd-select.module';

import { FormComponent } from './form.component';

import { ReportTimingService } from 'src/app/_shared/services/http/report-timing.service';

const routes: Routes = [
  {
    path: '',
    component: FormComponent,
    resolve: {

    }
  },
  {
    path: ':id',
    component: FormComponent,
    resolve: {

    }
  }
];

@NgModule({
  declarations: [FormComponent],
  imports: [
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    TranslateModule,
    BdSelectModule
  ],
  providers: [ReportTimingService]
})
export class FormModule {}
