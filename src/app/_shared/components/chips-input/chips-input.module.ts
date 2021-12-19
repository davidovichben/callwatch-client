import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

import { ChipsInputComponent } from './chips-input.component';

@NgModule({
  declarations: [
    ChipsInputComponent
  ],
  exports: [
    ChipsInputComponent
  ],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule
  ]
})
export class ChipsInputModule {}
