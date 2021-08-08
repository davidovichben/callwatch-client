import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { FileInputModule } from 'src/app/_shared/components/file-input/file-input.module';
import { TranslateModule } from 'src/app/_shared/pipes/translate/translate.module';

import { FormComponent } from './form.component';

const routes: Routes = [
  { path: '', component: FormComponent }
];

@NgModule({
  declarations: [FormComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    TranslateModule,
    FileInputModule,
    MatSelectModule,
    MatCheckboxModule
  ]
})
export class FormModule {}
