import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';

import { FileInputModule } from 'src/app/_shared/components/file-input/file-input.module';

import { FormComponent } from 'src/app/admin/organizations/form/form.component';

@NgModule({
  declarations: [FormComponent],
  imports: [
    FormsModule,
    MatDialogModule,
    MatSlideToggleModule,
    MatButtonModule,
    FileInputModule
  ],
  exports: [FormComponent]
})
export class FormModule {}
