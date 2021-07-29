import {
  Component, EventEmitter, HostListener, Output, Input, ElementRef,
  AfterViewInit, HostBinding
} from '@angular/core';

@Component({
  selector: 'bd-option',
  template: '<ng-content></ng-content>',
  styleUrls: ['./bd-option.component.css']
})
export class BdOptionComponent implements AfterViewInit {

  @Output() clicked = new EventEmitter();

  @Input() value;

  label: string;

  @HostBinding('class.selected') public selected = false;

  @HostBinding('style.display')
  display = 'block';

  @HostListener('click', ['$event.target'])
  onClick() {
    this.selected = !this.selected;
    this.clicked.emit(this.selected);
  }

  constructor(public elRef: ElementRef) {}

  ngAfterViewInit() {
    this.label = this.elRef.nativeElement.textContent;
  }

  toggleDisplay(hide: boolean): void {
    this.display = hide ? 'none' : 'block';
  }
}
