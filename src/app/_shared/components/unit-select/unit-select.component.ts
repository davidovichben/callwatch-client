import {
  Component,
  ElementRef, EventEmitter,
  forwardRef,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { UnitService } from 'src/app/_shared/services/http/unit.service';

import { TranslatePipe } from 'src/app/_shared/pipes/translate/translate.pipe';

import { Placeholder, SlideToggle } from 'src/app/_shared/constants/animations';
import { UnitModel } from 'src/app/_shared/models/unit.model';

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
export class UnitSelectComponent implements OnInit, OnChanges, ControlValueAccessor {

  @ViewChild('dropdownEle') dropdownEle: ElementRef;
  @ViewChild('widthElement') widthElement: ElementRef;

  @Input() units: any[] = [];
  @Input() placeholder;
  @Input() ignoredUnit: UnitModel;
  @Input() multiple = false;
  @Input() toggleUp = false;
  @Input() required = false;

  @Output() touched: EventEmitter<any> = new EventEmitter();

  title: string;

  isOpened = false;

  filterValue: string;
  filteredUnits: UnitModel[] = [];

  selected: any;

  currentCheckStatus = false;

  top: number;
  bottom: number;
  width: number;

  constructor(private elementRef: ElementRef, private unitService: UnitService,
              private t: TranslatePipe) {}

  ngOnInit() {
    if (!this.placeholder) {
      const keyword = this.multiple ? 'select_units' : 'select_unit';
      this.placeholder = this.t.transform(keyword);
    }

    this.loadUnits();

    if (this.multiple) {
      this.selected = [];
    }

    this.title = this.placeholder;
  }

  loadUnits(): void {
    let start = 0;
    const interval = setInterval(() => {
      this.filteredUnits = this.filteredUnits.concat(this.units.slice(start, start + 100));

      if (this.ignoredUnit) {
        this.ignoreUnit(this.filteredUnits);
      }

      if (start >= this.units.length) {
        clearInterval(interval);
      }

      start += 100;
    }, 200);
  }

  ngOnChanges(): void {
    if (this.ignoredUnit) {
      this.ignoreUnit(this.filteredUnits);
    }
  }

  ignoreUnit(units: UnitModel[]): void {
    units.forEach(unit => {
      const unitToIgnore = units.find(unit => unit.id === this.ignoredUnit.id);
      if (unitToIgnore) {
        (unitToIgnore as any).ignore = true;
        return;
      }

      if (unit.units) {
        this.ignoreUnit(unit.units)
      }
    });
  }

  toggleDropdown(): void {
    this.touched.emit();
    this.isOpened = !this.isOpened;
    this.setCoords();
  }

  @HostListener('window:scroll')
  @HostListener('window:resize')
  setCoords(): void {
    setTimeout(() => {
      const parentEle = this.elementRef.nativeElement.getBoundingClientRect();
      const offsetTop = this.dropdownEle.nativeElement.getBoundingClientRect().height;

      if ((window.innerHeight <= parentEle.bottom + offsetTop) || this.toggleUp) {
        this.bottom = window.innerHeight - parentEle.top - 8;
        this.top = null;
      } else {
        this.top = parentEle.bottom - 5;
        this.bottom = null;
      }

      this.width = this.widthElement.nativeElement.clientWidth;
    }, 0)
  }

  unitClicked(unit: UnitModel): void {
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

    unit.isToggled = !unit.isToggled;
    this.setCoords();
  }

  selectUnit(unit: UnitModel, checked?: boolean): void {
    if (!checked && this.currentCheckStatus) {
      this.currentCheckStatus = false;
    }

    let output;

    if (this.multiple) {
      this.checkUnit(checked, unit);
      this.selected = [];
      this.units.forEach(unit => this.setMultipleSelected(unit));

      if (!checked && unit.ancestors) {
        this.uncheckAncestors(unit);
      }

      output = this.selected.map(unit => unit.id);
    } else {
      this.selected = unit;
      this.isOpened = false;
      this.resetFilter();

      this.title = unit.name;

      output = unit.id;
    }

    this.propagateChange(output);
  }

  checkUnit(checked: boolean, unit: UnitModel): void {
    unit.checked = checked;
    if (unit.units) {
      unit.units.forEach(unit => this.checkUnit(checked, unit));
    }
  }

  hasMoreUnits(unit: UnitModel): boolean {
    const hasOnlyIgnoredUnit = unit.units.length === 1 && unit.units[0].ignore;
    return unit.units.length > 0 && !hasOnlyIgnoredUnit;
  }

  selectUnitById(unitId: number, units: UnitModel[]): void {
    units.forEach(unit => {
      if (unit.id == unitId) {
        this.selected = unit;
        this.title = unit.name;
        return;
      }

      if (unit.units) {
        this.selectUnitById(unitId, unit.units)
      }
    })
  }

  uncheckAncestors(unit: UnitModel): void {
    let units = this.units;
    unit.ancestors.forEach(ancestor => {
      const ancestorUnit = units.find(u => u.id === ancestor);
      const ancestorUnitIndex = this.selected.indexOf(ancestorUnit);

      if (ancestorUnitIndex !== -1) {
        this.selected.splice(ancestorUnitIndex, 1)
      }

      ancestorUnit.checked = false
      units = ancestorUnit.units
    });
  }

  private setMultipleSelected(unit: UnitModel): void {
    if (unit.checked) {
      this.selected.push(unit);
    }

    if (unit.units) {
      unit.units.forEach(unit => this.setMultipleSelected(unit));
    }
  }

  checkAll(isChecked: boolean): void {
    this.units.forEach(unit => this.checkUnit(isChecked, unit));
    this.selected = [];
    this.units.forEach(unit => this.setMultipleSelected(unit));

    this.currentCheckStatus = isChecked;
  }

  initFilter(value: string): void {
    this.filterValue = value;
    this.filteredUnits = [];

    if (!value) {
      this.resetFilter()
      return;
    }

    this.filterUnits(this.units);
  }

  resetFilter(): void {
    this.filterValue = '';
    this.filteredUnits = this.units;
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

  reset(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }

    this.selected = null;
    if (this.multiple) {
      this.checkAll(false);
      this.selected = [];
    }

    this.title = this.placeholder;
    this.propagateChange(this.selected);
  }

  private matchValues(unit: UnitModel, values: number[]): void {
    if (values.indexOf(unit.id) !== -1) {
      this.checkUnit(true, unit);
    }

    if (unit.units) {
      unit.units.forEach(unit => this.matchValues(unit, values));
    }
  }

  hasValue(): boolean {
    return this.selected && (!this.multiple || this.selected.length > 0);
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
      this.selectUnitById(value, this.units)
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

    if (!this.elementRef.nativeElement.contains(e.target)) {
      this.isOpened = false;
      setTimeout(() => this.resetFilter(), 500);
    }
  }
}
