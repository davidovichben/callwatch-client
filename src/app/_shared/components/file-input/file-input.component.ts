import { Component, EventEmitter, Input, Output } from '@angular/core';

import { ErrorMessages } from 'src/app/_shared/constants/error-messages';
import { fade } from 'src/app/_shared/constants/animations';

@Component({
  selector: 'app-file-input',
  templateUrl: './file-input.component.html',
  styleUrls: ['./file-input.component.styl'],
  animations: [fade]
})
export class FileInputComponent {

  @Output() fileUploaded = new EventEmitter();
  @Output() fileCleared = new EventEmitter();

  @Input() inputFile: File;

  @Input() required = false;
  @Input() sizeLimit; // In megabytes
  @Input() types;

  readonly MegaByte = 1000000;

  readonly errorMessages = ErrorMessages;

  hasSizeError = false;
  hasTypeError = false;

  file: File;

  fileChange(file: File): void {
    if (this.sizeLimit && file.size / this.MegaByte > this.sizeLimit) {
      this.hasSizeError = true;
      return;
    }

    const type = file.name.substr(file.name.lastIndexOf('.') + 1);
    if (this.types && this.types.indexOf(type) === -1) {
      this.hasTypeError = true;
      return;
    }

    this.hasSizeError = false;
    this.hasTypeError = false;

    this.file = file;
    this.fileUploaded.emit(file);
  }

  resetFile(element: HTMLInputElement): void {
    element.files = null;
    this.file = null;
    this.fileCleared.emit(true);
  }
}
