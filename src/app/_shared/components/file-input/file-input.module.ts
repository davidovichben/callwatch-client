import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { TruncateModule } from 'src/app/_shared/pipes/truncate/truncate.module';

import { FileInputComponent } from './file-input.component';


@NgModule({
  declarations: [FileInputComponent],
    imports: [
      CommonModule,
      TruncateModule,
      MatIconModule,
      MatButtonModule
    ],
  exports: [FileInputComponent]
})
export class FileInputModule {}
