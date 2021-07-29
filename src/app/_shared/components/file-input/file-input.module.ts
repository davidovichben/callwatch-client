import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TruncateModule } from 'src/app/_shared/pipes/truncate/truncate.module';

import { FileInputComponent } from './file-input.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [FileInputComponent],
    imports: [CommonModule, TruncateModule, MatIconModule, MatButtonModule],
  exports: [FileInputComponent]
})
export class FileInputModule {}
