import {
  Component, EventEmitter, HostListener, Output, Input, ElementRef,
  AfterViewInit, HostBinding
} from '@angular/core';

@Component({
  selector: 'bd-option',
  template: '<ng-content></ng-content>',
  styleUrls: ['./bd-option.component.sass']
})
export class BdOptionComponent implements AfterViewInit {
  @Output() clicked = new EventEmitter<boolean>();
  @Input() value: any;
  @Input() disabled: boolean = false;

  label: string = '';

  @HostBinding('class.selected') public selected: boolean = false;
  @Input() @HostBinding('class.default') public default: boolean = false;
  @HostBinding('class.disabled') get isDisabled(): boolean { return this.disabled; }

  @HostBinding('style.display') display: string = 'block';
  
  @HostBinding('attr.role') role: string = 'option';
  @HostBinding('attr.aria-selected') get ariaSelected(): string { return String(this.selected); }
  @HostBinding('attr.tabindex') get tabIndex(): string { return this.disabled ? '-1' : '0'; }

  @HostListener('click', ['$event'])
  onClick(event?: MouseEvent): void {
    if (this.disabled) {
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }
      return;
    }
    
    this.selected = !this.selected;
    this.clicked.emit(this.selected);
  }
  
  @HostListener('keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent): void {
    if (this.disabled) {
      return;
    }
    
    // Handle keyboard selection
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.onClick();
    }
  }

  constructor(public elRef: ElementRef<HTMLElement>) {}

  ngAfterViewInit(): void {
    // Get the option label from the element content
    setTimeout(() => {
      this.label = this.elRef.nativeElement.textContent?.trim() || '';
    });
  }

  toggleDisplay(hide: boolean): void {
    this.display = hide ? 'none' : 'block';
  }
}
