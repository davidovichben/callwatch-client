import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { TranslateModule } from 'src/app/_shared/pipes/translate/translate.module';

import { WidgetFormComponent } from './widget-form.component';
import { ConditionalDesignComponent } from './conditional-design/conditional-design.component';

@NgModule({
  declarations: [WidgetFormComponent, ConditionalDesignComponent],
    imports: [
      CommonModule,
      ReactiveFormsModule,
      MatFormFieldModule,
      MatInputModule,
      MatSelectModule,
      MatDialogModule,
      MatIconModule,
      TranslateModule,
      MatCheckboxModule
    ],
  exports: [WidgetFormComponent, ConditionalDesignComponent]
})
export class WidgetFormModule {}
