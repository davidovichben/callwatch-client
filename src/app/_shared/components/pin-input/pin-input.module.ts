import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { PinInputComponent } from './pin-input.component';

@NgModule({
  declarations: [PinInputComponent],
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule, MatFormFieldModule
  ],
  exports: [PinInputComponent]
})
export class PinInputModule {}
