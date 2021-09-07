import {
  AfterViewInit,
  Component,
  ElementRef,
  forwardRef,
  HostListener,
  Input,
  OnInit,
  ViewChild
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

  @ViewChild('select') selectEle: ElementRef;

  @Input() units: UnitModel[] = [];
  @Input() required: boolean;
  @Input() placeholder = 'select_unit';

  readonly position = {
    x: 0,
    y: 0
  }

  width: number;

  isOpened = false;

  filterValue: string;
  filteredUnits: UnitModel[] =[];

  selectedUnit: UnitModel;

  constructor(private elementRef: ElementRef) {}

  ngOnInit() {
    this.filteredUnits = this.units;
  }

  ngAfterViewInit() {
    const ele = this.selectEle.nativeElement;
    const y = ele.offsetTop;
    const x = ele.offsetLeft;

    setTimeout(() => {
      this.width = ele.clientWidth;
      this.position.x = x;
      this.position.y = y;
    }, 0)
  }

  selectUnit(unit: UnitModel): void {
    this.selectedUnit = unit;
    this.isOpened = false;

    this.propagateChange(this.selectedUnit.id);
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

  private propagateChange = (_: any) => {};

  writeValue(unit: UnitModel): void {
    if (!unit) {
      return;
    }

    this.selectedUnit = unit;
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
