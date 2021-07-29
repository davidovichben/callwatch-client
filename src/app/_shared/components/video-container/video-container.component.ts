import { Component, ElementRef, HostListener, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'app-video-container',
  templateUrl: './video-container.component.html',
  styleUrls: ['./video-container.component.styl']
})
export class VideoContainerComponent {

  @ViewChild('videoElement') videoEle: ElementRef;

  @Input() video;

  isPlaying = false;
  isHovering = false;

  @HostListener('mouseover', ['$event.target'])
  onMouseOver() {
    this.isHovering = true;
  }

  @HostListener('mouseout', ['$event.target'])
  onMouseOut() {
    this.isHovering = false;
  }

  play(): void {
    this.isPlaying = true;
    this.videoEle.nativeElement.play();
  }

  pause(): void {
    this.isPlaying = false;
    this.videoEle.nativeElement.pause();
  }
}
