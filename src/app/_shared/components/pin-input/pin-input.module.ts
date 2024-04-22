import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';

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
