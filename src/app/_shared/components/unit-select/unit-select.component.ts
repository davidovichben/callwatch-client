import { AfterViewInit, Component, ElementRef, forwardRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { UnitModel } from 'src/app/_shared/models/unit.model';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { UnitService } from 'src/app/_shared/services/http/unit.service';

import { Placeholder, SlideToggle } from 'src/app/_shared/constants/animations';

@Component({
  selector: 'app-unit-select',
  templateUrl: './unit-select.component.html',
  styleUrls: ['./unit-select.component.styl'],
  animations: [SlideToggle, Placeholder],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => UnitSelectComponent),
    }
  ]
})
export class UnitSelectComponent implements OnInit, AfterViewInit, ControlValueAccessor {

  @ViewChild('dropdownEle') dropdownEle: ElementRef;
  @ViewChild('widthElement') widthElement: ElementRef;

  @Input() units: UnitModel[] = [];
  @Input() required: boolean;
  @Input() placeholder = 'select_unit';
  @Input() multiple = false;
  @Input() hasError = false;

  title: string;

  isOpened = false;

  filterValue: string;
  filteredUnits: UnitModel[] =[];

  selected: any;

  top: number;
  bottom: number;
  width: number;

  constructor(private elementRef: ElementRef, private unitService: UnitService) {}

  ngOnInit() {
    this.filteredUnits = this.units;
    if (this.multiple) {
      this.selected = [];
    }

    if (this.required) {
      this.placeholder += '*';
    }

    this.title = this.placeholder;
  }

  ngAfterViewInit() {
    this.setCoords();
  }

  toggleDropdown(): void {
    this.isOpened = !this.isOpened;
    this.setCoords();
  }

  @HostListener('window:scroll')
  @HostListener('window:resize')
  setCoords(): void {
    setTimeout(() => {
      const parentEle = this.elementRef.nativeElement.getBoundingClientRect();
      const dropdownEle = this.dropdownEle.nativeElement.getBoundingClientRect();

      const offsetTop = dropdownEle.height;

      if (window.innerHeight <= parentEle.bottom + offsetTop) {
        this.bottom = window.innerHeight - parentEle.top - 8;
        this.top = null;
      } else {
        this.top = parentEle.bottom - 5;
        this.bottom = null;
      }

      this.width = this.widthElement.nativeElement.clientWidth;
    }, 0)
  }

  unitClicked(unit): void {
    if (this.multiple) {
      this.toggleUnit(unit);
    } else {
      this.selectUnit(unit);
    }
  }

  toggleUnit(unit: any, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }

    if (unit.units || unit.isToggled) {
      unit.isToggled = !unit.isToggled;
      this.setCoords();
      return;
    }

    this.unitService.getUnits(unit.id).then(response => {
      unit.units = response;
      unit.isToggled = true;
      this.setCoords();
    });
  }

  selectUnit(unit: UnitModel, checked?: boolean): void {
    let output;
    if (this.multiple) {
      this.checkUnit(checked, unit);
      this.selected = [];
      this.units.forEach(unit => this.setMultipleSelected(unit));

      output = this.selected.map(unit => unit.id);
    } else {
      this.selected = unit;
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

  checkAll(checked: boolean): void {
    this.units.forEach(unit => this.checkUnit(checked, unit));
    this.selected = [];
    this.units.forEach(unit => this.setMultipleSelected(unit));
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
