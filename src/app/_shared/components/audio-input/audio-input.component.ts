import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, Renderer2, ViewChild } from '@angular/core';

import { HelpersService } from 'src/app/_shared/services/generic/helpers.service';

import { TranslatePipe } from 'src/app/_shared/pipes/translate/translate.pipe';

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
  @Input() inputFile: { bin: string, name: string };
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

  loadedUnlistener: () => void;
  timeUnlistener: () => void;

  file: any;

  playing = false;

  hasTypeError = false;

  constructor(private renderer: Renderer2, private t: TranslatePipe,
              private helpers: HelpersService) {}

  ngOnInit(): void {
    if (!this.placeholder) {
      this.placeholder = this.t.transform('upload_audio_file');
    }
  }

  ngAfterViewInit(): void {
    if (this.inputFile) {
      const file = this.helpers.base64toFile(this.inputFile.bin, this.inputFile.name);
      setTimeout(() => this.readFile(file), 0);
    }

    this.loadedUnlistener = this.renderer.listen(this.audioPlayer.nativeElement, 'loadedmetadata', () => {
      this.setTime('duration');
      this.setTime('currentTime');
    });

    this.timeUnlistener = this.renderer.listen(this.audioPlayer.nativeElement, 'timeupdate', () => {
      this.setTime('currentTime');
    });
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

    this.readFile(file, true);
  }

  private readFile(file: File, emit?: boolean): void {
    const reader = new FileReader();
    reader.onload = (() => {
      this.audioPlayer.nativeElement.src = reader.result;

      if (emit) {
        this.fileChange.emit({ bin: reader.result, name: file.name });
      }
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
    this.loadedUnlistener();
    this.timeUnlistener()
  }
}
