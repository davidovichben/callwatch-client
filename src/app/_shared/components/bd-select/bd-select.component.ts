import {
	Component,
	ElementRef,
	EventEmitter,
	HostBinding,
	HostListener,
	Input,
	Output,
	ViewChild,
	QueryList, ContentChildren, AfterContentInit, OnDestroy, OnInit
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Subscription } from 'rxjs';

import { BdOptionComponent } from './bd-option/bd-option.component';

import { TranslatePipe } from 'src/app/_shared/pipes/translate/translate.pipe';

@Component({
  selector: 'bd-select',
  templateUrl: './bd-select.component.html',
  styleUrls: ['./bd-select.component.sass'],
  animations: [
    trigger('slideToggle', [
      state('inactive', style({
        display: 'none',
        height: '0',
        opacity: '0'
      })),
      state('active', style({
        display: 'block',
        height: '*',
        opacity: '1'
      })),
      transition('active => inactive', animate('0ms ease-in')),
      transition('inactive => active', animate('0ms ease-out'))
    ]),
    trigger('placeholder', [
      state('inactive', style({
        top: '*',
        lineHeight: '*',
        padding: '0',
        fontSize: '*'
      })),
      state('active', style({
        top: '-5px',
        lineHeight: '0.6',
        padding: '0 4px',
        fontSize: '12px'
      })),
      transition('active => inactive', animate('200ms')),
      transition('inactive => active', animate('200ms'))
    ])
  ],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: BdSelectComponent, multi: true }
  ]
})
export class BdSelectComponent implements ControlValueAccessor, AfterContentInit, OnInit, OnDestroy {
  // Input properties
  @Input() optionsHeight: string = '280px';
  @Input() multiple: boolean = false;
  @Input() placeholder?: string;
  @Input() searchPlaceholder?: string;
  @Input() scrollBottom: boolean = false;
  @Input() required: boolean = false;
  @Input() hasError: boolean = false;
  @Input() disabled: boolean = false;

  // Output events
  @Output() selected: EventEmitter<any> = new EventEmitter<any>();
  @Output() deselected: EventEmitter<boolean> = new EventEmitter<boolean>();

  // Host bindings
  @HostBinding('style.display') display: string = 'block';
  @HostBinding('style.width') width: string = '100%';
  @HostBinding('class.unfiltered') private unfiltered: boolean = true;
  @HostBinding('class.mat-error') get errorState(): boolean { return this.hasError; }
  @HostBinding('attr.tabindex') get tabIndex(): string { return this.disabled ? '-1' : '0'; }
  @HostBinding('attr.role') role: string = 'combobox';
  @HostBinding('attr.aria-expanded') get ariaExpanded(): string { return String(this.isSelectOpened); }
  @HostBinding('attr.aria-required') get ariaRequired(): string { return String(this.required); }
  @HostBinding('attr.aria-disabled') get ariaDisabled(): string { return String(this.disabled); }

  // View queries
  @ContentChildren(BdOptionComponent) options!: QueryList<BdOptionComponent>;
  @ViewChild('dropdown', { static: false }) dropdown!: ElementRef<HTMLElement>;
  @ViewChild('filterInput', { static: false }) filterInputRef?: ElementRef<HTMLInputElement>;

  // Component state
  filterValue: string = '';
  isSelectOpened: boolean = false;
  initialValue: any = null;
  value: any = null;
  label: any = null;
  activeOption?: BdOptionComponent;
  private readonly subscriptions = new Subscription();
  private touchedFn: () => void = () => {};

  constructor(private elementRef: ElementRef<HTMLElement>, private t: TranslatePipe) {}

  // Lifecycle hooks
  ngOnInit(): void {
    this.initializeLabels();
  }

  ngAfterContentInit(): void {
    this.initializeState();
    this.setupOptionsListeners();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  // Public methods
  filter(): void {
    if (!this.filterValue) {
      this.unfiltered = true;
      return;
    }

    this.unfiltered = false;
    const filterValue = this.filterValue.toString().toLowerCase();

    this.options.forEach(option => {
      const filtered = option.label.toLowerCase().indexOf(filterValue) === -1;
      option.toggleDisplay(filtered);
    });
  }

  resetValue(event?: MouseEvent): void {
    if (event) {
      event.stopPropagation();
    }

    this.value = null;
    this.label = null;
    this.isSelectOpened = false;
    this.deselected.emit(true);
    this.propagateChange(null);
    this.touchedFn();
  }

  openDropdown(): void {
    if (this.disabled) {
      return;
    }

    this.isSelectOpened = !this.isSelectOpened;
    
    if (this.isSelectOpened) {
      // Focus on filter input if it exists
      setTimeout(() => {
        if (this.filterInputRef) {
          this.filterInputRef.nativeElement.focus();
        }
      }, 0);
      
      if (this.scrollBottom) {
        this.scrollToBottom();
      }
    }
    
    this.touchedFn();
  }

  scrollToBottom(): void {
    setTimeout(() => {
      if (this.dropdown?.nativeElement) {
        this.dropdown.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }
    }, 360);
  }

  // ControlValueAccessor implementation
  writeValue(value: any): void {
    if (value) {
      this.initialValue = value;
    }

    if (!value) {
      this.resetValue();
    }
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.touchedFn = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
  
  // Keyboard navigation
  @HostListener('keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent): void {
    if (this.disabled) {
      return;
    }
    
    // Handle keyboard navigation
    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        this.openDropdown();
        break;
      case 'Escape':
        event.preventDefault();
        if (this.isSelectOpened) {
          this.isSelectOpened = false;
          this.touchedFn();
        }
        break;
      case 'Tab':
        if (this.isSelectOpened) {
          this.isSelectOpened = false;
        }
        break;
    }
  }

  // Click outside handler
  @HostListener('document:click', ['$event'])
  documentClicked(event: MouseEvent): void {
    if (!this.isSelectOpened) {
      return;
    }

    const clickTarget = event.target as HTMLElement;
    if (!this.elementRef.nativeElement.contains(clickTarget)) {
      this.isSelectOpened = false;
      this.resetFilterAndUpdateDisplay();
    }
  }

  // Private methods
  private initializeLabels(): void {
    if (!this.placeholder) {
      this.placeholder = this.t.transform('select_items');
    }

    if (!this.searchPlaceholder) {
      this.searchPlaceholder = this.t.transform('search') + '...';
    }
  }

  private initializeState(): void {
    if (this.required && this.placeholder) {
      this.placeholder += '*';
    }

    if (this.multiple) {
      this.value = [];
      this.label = [];
    }
  }

  private setupOptionsListeners(): void {
    // Listen for changes to the options QueryList
    this.subscriptions.add(
      this.options.changes.subscribe(() => {
        this.setupOptionClickListeners();
      })
    );

    // Initial setup
    setTimeout(() => this.setupOptionClickListeners(), 0);
  }

  private setupOptionClickListeners(): void {
    // Clean up previous listeners to avoid memory leaks
    this.options.forEach(option => {
      // Setup click listeners
      this.subscriptions.add(
        option.clicked.subscribe((isClicked: boolean) => {
          this.handleOptionClick(option, isClicked);
        })
      );

      // Initialize selection based on initialValue
      if (this.initialValue) {
        const shouldSelect = this.multiple
          ? this.initialValue.indexOf(option.value) !== -1
          : this.initialValue === option.value;
          
        if (shouldSelect) {
          option.onClick();
        }
      }
    });
  }

  private handleOptionClick(option: BdOptionComponent, isClicked: boolean): void {
    if (isClicked) {
      this.handleOptionSelected(option);
    } else {
      this.handleOptionDeselected(option);
    }

    this.selected.emit(this.value);
    this.propagateChange(this.value);
    this.touchedFn();
  }

  private handleOptionSelected(option: BdOptionComponent): void {
    if (this.multiple) {
      this.value.push(option.value);
      this.label.push(option.label);
    } else {
      // Deselect a previous option if exists
      if (this.activeOption && this.activeOption !== option) {
        this.activeOption.selected = false;
      }

      this.value = option.value;
      this.label = option.label;
      this.activeOption = option;
      this.isSelectOpened = false;
      this.resetFilterAndUpdateDisplay();
    }
  }

  private handleOptionDeselected(option: BdOptionComponent): void {
    if (this.multiple) {
      const valueIndex = this.value.findIndex((item: any) => item === option.value);
      const labelIndex = this.label.findIndex((item: string) => item === option.label);
      
      if (valueIndex !== -1) {
        this.value.splice(valueIndex, 1);
      }
      
      if (labelIndex !== -1) {
        this.label.splice(labelIndex, 1);
      }
    } else {
      this.value = null;
      this.label = null;
      this.activeOption = undefined;
    }
  }

  private resetFilterAndUpdateDisplay(): void {
    setTimeout(() => {
      this.filterValue = '';
      this.unfiltered = true;
    }, 300);
  }

  private propagateChange = (_: any) => {};
}
