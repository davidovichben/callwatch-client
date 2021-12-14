import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Fade } from 'src/app/_shared/constants/animations';

import * as FileSaver from 'file-saver';
import { TranslatePipe } from 'src/app/_shared/pipes/translate/translate.pipe';

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
  @Input() disabled = false;

  @Output() fileChange = new EventEmitter();

  readonly duration: { minutes: number, seconds: number | string } = {
    minutes: 0,
    seconds: 0
  }

  readonly currentTime: { minutes: number, seconds: number | string } = {
    minutes: 0,
    seconds: 0
  }

  file: any;

  playing = false;

  hasTypeError = false;

  constructor(private t: TranslatePipe) {}

  ngOnInit(): void {
    if (!this.placeholder) {
      this.placeholder = this.t.transform('upload_audio_file');
    }
  }

  ngAfterViewInit(): void {
    if (this.inputFile) {
      setTimeout(() => this.uploadFile(this.inputFile), 0);
    }

    this.audioPlayer.nativeElement.addEventListener('loadedmetadata', () => {
      this.setTime('duration');
      this.setTime('currentTime');
    });

    this.audioPlayer.nativeElement.addEventListener('timeupdate', () => this.setTime('currentTime'));
  }

  private setTime(timeType: 'duration' | 'currentTime'): void {
    const ele = this.audioPlayer.nativeElement;
    const seconds = Math.round(ele[timeType] % 60);

    this[timeType].minutes = Math.floor(ele[timeType] / 60);
    this[timeType].seconds = seconds < 10 ? '0' + seconds : seconds;
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
    this.playing = false;

    this.file = null;
    this.audioPlayer.nativeElement.src = null;
    this.audioFileInput.nativeElement.value = '';

    this.fileChange.emit(null);
  }

  ngOnDestroy(): void {
    this.audioPlayer.nativeElement.removeEventListener('loadedmetadata');
    this.audioPlayer.nativeElement.removeEventListener('timeupdate');
  }
}
