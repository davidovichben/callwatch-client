import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';

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
