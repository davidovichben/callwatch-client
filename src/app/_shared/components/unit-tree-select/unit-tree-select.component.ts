import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { UnitModel } from 'src/app/_shared/models/unit.model';

@Component({
  selector: 'app-unit-tree-select',
  templateUrl: './unit-tree-select.component.html',
  styleUrls: ['./unit-tree-select.component.styl'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => UnitTreeSelectComponent),
    }
  ]
})
export class UnitTreeSelectComponent implements OnInit, ControlValueAccessor {

  @Input() units: UnitModel[];
  @Input() isRootUser = false;

  readonly rootUnit = {
    id: 'root',
    name: 'root',
    units: []
  }

  checkedUnits: UnitModel[] = [];

  ngOnInit() {
    this.rootUnit.units = this.units;
  }

  selectAll(): void {
    this.setUnit(true, this.rootUnit);
  }

  setUnit(checked: boolean, unit?: UnitModel): void {
    if (checked) {
      this.checkedUnits.push(unit.id);
    } else {
      const index = this.checkedUnits.indexOf(unit.id);
      this.checkedUnits.splice(index, 1);
    }

    if (unit.units) {
      unit.units.forEach(iteratedUnit => {
        this.setUnit(checked, iteratedUnit)
      });
    }

    this.propagateChange(this.checkedUnits);
  }

  unitChecked(unitId: any): boolean {
    return this.checkedUnits.indexOf(unitId) !== -1;
  }

  private propagateChange = (_: any) => {};

  writeValue(values: UnitModel[]): void {
    if (!values) {
      return;
    }

    this.checkedUnits = values;
  }

  registerOnChange(fn: any) {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {

  }
}
