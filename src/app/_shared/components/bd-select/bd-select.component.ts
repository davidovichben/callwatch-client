import {
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  Output,
  ViewChild,
  QueryList, ContentChildren, AfterContentInit, OnDestroy
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Subscription } from 'rxjs';

import { BdOptionComponent } from './bd-option/bd-option.component';

@Component({
	selector: 'bd-select',
	templateUrl: './bd-select.component.html',
	styleUrls: ['./bd-select.component.css'],
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
				fontSize: '*',
				top: '*',
				color: '*',
				fontWeight: 'normal'
			})),
			state('active', style({
        top: '-12px',
        fontSize: '12px',
				color: '#000',
				opacity: '.54',
				fontWeight: 'bold'
			})),
			transition('active => inactive', animate('300ms ease-in')),
			transition('inactive => active', animate('300ms ease-in'))
		])
	],
	providers: [
		{ provide: NG_VALUE_ACCESSOR, useExisting: BdSelectComponent, multi: true }
	]
})
export class BdSelectComponent implements ControlValueAccessor, AfterContentInit, OnDestroy {

  @Input() @HostBinding('style.width') width = '300px';
  @Input() optionsHeight = '280px';

  @Input() multiple = false;
  @Input() placeholder = 'בחר פריטים';
  @Input() searchPlaceholder = 'חפש...';
  @Input() scrollBottom = false;

  @Output() selected: EventEmitter<any> = new EventEmitter();
  @Output() deselected: EventEmitter<boolean> = new EventEmitter();

  @HostBinding('class.unfiltered') private unfiltered: boolean;

  @ContentChildren(BdOptionComponent) options: QueryList<BdOptionComponent>;

  @ViewChild('dropdown', { static: false }) dropdown: ElementRef;

  readonly sub = new Subscription();

	filterValue: string;

	isSelectOpened = false;

	initialValue: any;

	value: any;
	label: any;
  activeOption: BdOptionComponent;

  constructor(private elementRef: ElementRef) {}

  ngAfterContentInit() {
    if (this.multiple) {
      this.value = [];
      this.label = [];
    }

    this.sub.add(this.options.changes.subscribe(() => {
      this.listenOptionsClicked();
    }));

    setTimeout(() => this.listenOptionsClicked(), 0);
  }

  private listenOptionsClicked(): void {
    this.options.forEach(option => {
      this.sub.add(option.clicked.subscribe(isClicked => {
        this.optionClickedHandler(option, isClicked);
      }));

      if (this.initialValue &&
        (this.multiple && this.initialValue.indexOf(option.value) !== -1) ||
        (!this.multiple && this.initialValue === option.value)) {
        option.onClick();
      }
    });
  }

  private optionClickedHandler(option: BdOptionComponent, isClicked: boolean): void {
    if (isClicked) {
      if (this.multiple) {
        this.value.push(option.value);
        this.label.push(option.label);
      } else {
        if (this.activeOption && this.activeOption !== option) {
          this.activeOption.selected = false;
        }

        this.value = option.value;

        this.label = option.label;
        this.activeOption = option;

        this.isSelectOpened = false;
      }
    } else {
      if (this.multiple) {
        this.value.splice(this.value.findIndex(item => item === option.value), 1);
        this.label.splice(this.label.findIndex(item => item === option.label), 1);
      } else {
        this.value = null;
        this.label = null;
      }
    }

    this.selected.emit(this.value);
    this.propagateChange(this.value);
  }

	filter(): void {
    const filterValue = this.filterValue.toString().toLowerCase();
    if (!filterValue) {
      this.unfiltered = true;
      return;
    }

    this.unfiltered = false;

    this.options.forEach(option => {
      const filtered = option.label.indexOf(filterValue) === -1;
      option.toggleDisplay(filtered);
    });
	}

	resetValue(event?: MouseEvent): void {
    if (event) {
      event.stopPropagation();
    }

    this.value = null;
    this.label = null;

    this.deselected.emit(true);
    this.propagateChange(null);
  }

	openDropdown(): void {
		this.isSelectOpened = !this.isSelectOpened;
		if (this.isSelectOpened && this.scrollBottom) {
			this.scrollToBottom();
		}
	}

	scrollToBottom(): void {
		setTimeout(() => this.dropdown.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'end' }), 360);
	}

  private propagateChange = (_: any) => {};

  writeValue(value: any): void {
    if (value) {
      this.initialValue = value;
	  }

    if (!value) {
      this.resetValue();
    }
	}

	registerOnChange(fn: any) {
		this.propagateChange = fn;
	}

	registerOnTouched(fn: any): void {

	}

	setDisabledState(isDisabled: boolean): void {

	}

  @HostListener('document:click')
  documentClicked() {
    if (!this.isSelectOpened) {
      return;
    }

    let clickedComponent = event.target;
    let inside = false;

    do {
      if (clickedComponent === this.elementRef.nativeElement) {
        inside = true;
      }

      clickedComponent = clickedComponent['parentNode'];
    } while (clickedComponent);

    if (!inside) {
      this.isSelectOpened = false;
      setTimeout(() => {
        this.filterValue = '';
        this.unfiltered = true;
      }, 500);
    }
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
