import {
  AfterViewInit,
  Component,
  ElementRef,
  forwardRef,
  HostListener,
  Input,
  OnInit
} from '@angular/core';
import { UnitModel } from 'src/app/_shared/models/unit.model';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-unit-select',
  templateUrl: './unit-select.component.html',
  styleUrls: ['./unit-select.component.styl'],
  animations: [
    trigger('slideDown', [
      state('inactive', style({
        display: 'none',
        height: '0',
        opacity: '0',
      })),
      state('active', style({
        display: '*',
        height: '*',
        opacity: '1',
      })),
      transition('inactive => active', animate('200ms ease-in')),
      transition('active => inactive', animate('200ms ease-out'))
    ])
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => UnitSelectComponent),
    }
  ]
})
export class UnitSelectComponent implements OnInit, AfterViewInit, ControlValueAccessor {

  @Input() units: UnitModel[] = [];
  @Input() required: boolean;
  @Input() placeholder = 'select_unit';
  @Input() multiple = false;

  title: string;

  width: number;

  isOpened = false;

  filterValue: string;
  filteredUnits: UnitModel[] =[];

  selected: any;

  constructor(private elementRef: ElementRef) {}

  ngOnInit() {
    this.filteredUnits = this.units;
    if (this.multiple) {
      this.selected = [];
    }

    this.title = this.placeholder;
  }

  ngAfterViewInit() {
    // const ele = this.selectEle.nativeElement.getBoundingClientRect();
    // const y = ele.top;
    // const x = ele.right - ele.left;
    //
    // setTimeout(() => {
    //   this.width = ele.width;
    //   this.position.x = x;
    //   this.position.y = y;
    // }, 0)
  }

  selectUnit(unit: UnitModel, checked?: boolean): void {
    let output;
    if (this.multiple) {
      this.checkUnit(checked, unit);
      this.selected = [];
      this.units.forEach(unit => this.setMultipleSelected(unit));
      this.setMultipleTitle();

      output = this.selected.map(unit => unit.id);
    } else {
      this.isOpened = false;

      this.title = unit.name;

      output = unit.id;
    }

    this.propagateChange(output);
  }

  private checkUnit(checked: boolean, unit: UnitModel): void {
    unit.checked = checked;
    if (unit.units) {
      unit.units.forEach(unit => this.checkUnit(checked, unit));
    }
  }

  private setMultipleSelected(unit: UnitModel): void {
    if (unit.checked) {
      this.selected.push(unit);
    }

    if (unit.units) {
      unit.units.forEach(unit => this.setMultipleSelected(unit));
    }
  }

  private setMultipleTitle(): void {
    this.title = '';
    this.selected.forEach((unit, index) => {
      this.title += unit.name;
      if (index + 1 < this.selected.length) {
        this.title += ', ';
      }
    });
  }

  checkAll(checked: boolean): void {
    this.units.forEach(unit => this.checkUnit(checked, unit));
    this.selected = [];
    this.units.forEach(unit => this.setMultipleSelected(unit));
    this.setMultipleTitle();
  }

  initFilter(value: string): void {
    this.filterValue = value;
    this.filteredUnits = [];
    this.filterUnits(this.units);
  }

  private filterUnits(units: UnitModel[]): void {
    units.forEach(unit => {
      if (unit.name.indexOf(this.filterValue) !== -1) {
        this.filteredUnits.push(unit);
      }

      if (unit.units) {
        this.filterUnits(unit.units);
      }

      return true;
    })
  }

  reset(event: Event): void {
    event.stopPropagation();

    this.selected = null;
    if (this.multiple) {
      this.checkAll(false);
      this.selected = [];
    }

    this.title = this.placeholder;
  }

  private matchValues(unit: UnitModel, values: number[]): void {
    if (values.indexOf(unit.id) !== -1) {
      this.checkUnit(true, unit);
    }

    if (unit.units) {
      unit.units.forEach(unit => this.matchValues(unit, values));
    }
  }

  private propagateChange = (_: any) => {};

  writeValue(value: any): void {
    if (!value || value.length === 0) {
      return;
    }

    if (this.multiple) {
      // TODO: make a combined filter for search and value writing

      this.units.forEach(unit => this.matchValues(unit, value));
      this.selected = [];
      this.units.forEach(unit => this.setMultipleSelected(unit));
      this.setMultipleTitle();
    } else {
      this.selected = value;
    }
  }

  registerOnChange(fn: any) {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {

  }

  @HostListener('document:click', ['$event'])
  documentClicked(e: PointerEvent): void {
    if (!this.isOpened) {
      return;
    }

    let clickedComponent: any = e.target;
    let inside = false;

    do {
      if (clickedComponent === this.elementRef.nativeElement) {
        inside = true;
      }

      clickedComponent = clickedComponent.parentNode;
    } while (clickedComponent) {
      if (!inside) {
        this.isOpened = false;
        setTimeout(() => {
          this.filterValue = '';
          this.filteredUnits = this.units;
        }, 500);
      }
    }
  }
}
