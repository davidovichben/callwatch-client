import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Fade } from 'src/app/_shared/constants/animations';

import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-audio-input',
  templateUrl: './audio-input.component.html',
  styleUrls: ['audio-input.component.styl'],
  animations: [Fade]
})
export class AudioInputComponent implements AfterViewInit {

  @ViewChild('audioPlayer') audioPlayer: ElementRef;
  @ViewChild('audioFileInput') audioFileInput: ElementRef;

  @Input() placeholder: string;
  @Input() fileTypes;
  @Input() inputFile: File;

  @Output() fileChange = new EventEmitter();

  file: any;

  playing = false;

  hasTypeError = false;

  ngAfterViewInit() {
    if (this.inputFile) {
      this.uploadFile(this.inputFile);
    }
  }

  uploadFile(file: File): void {
    if (file.type.indexOf('audio') === -1) {
      this.hasTypeError = true;
      return;
    }

    const fileExt = file.type.substr(6);
    if (this.fileTypes && this.fileTypes.indexOf(fileExt) === -1) {
      this.hasTypeError = true;
      return;
    }

    this.hasTypeError = false;

    const reader = new FileReader();
    reader.onload = (() => {
      this.audioPlayer.nativeElement.src = reader.result;
      this.fileChange.emit({ bin: reader.result, name: file.name });
    });

    reader.readAsDataURL(file);
    this.file = file;
  }

  downloadFile(): void {
    FileSaver.saveAs(this.file, this.file.name);
  }

  resetFile(): void {
    this.file = null;
    this.audioPlayer.nativeElement.src = null;
    this.audioFileInput.nativeElement.value = '';

    this.fileChange.emit(null);
  }
}
