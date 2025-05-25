import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArrayToStringPipe } from './array-to-string.pipe';

@NgModule({
  declarations: [ArrayToStringPipe],
  imports: [CommonModule],
  exports: [ArrayToStringPipe]
})
export class ArrayToStringModule {}
