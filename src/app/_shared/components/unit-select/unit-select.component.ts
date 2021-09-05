import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { UnitModel } from 'src/app/_shared/models/unit.model';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-unit-select',
  templateUrl: './unit-select.component.html',
  styleUrls: ['./unit-select.component.styl'],
  animations: [
    trigger('slideDown', [
      state('inactive', style({
        height: '0',
        opacity: '0',
      })),
      state('active', style({
        height: '*',
        opacity: '1',
      })),
      transition('inactive => active', animate('200ms ease-in')),
      transition('active => inactive', animate('200ms ease-out'))
    ])
  ]
})
export class UnitSelectComponent implements AfterViewInit {

  @ViewChild('select') selectEle: ElementRef;

  @Input() units: UnitModel[] = [];

  readonly position = {
    x: 0,
    y: 0
  }

  isOpened = false;

  constructor() {
  }

  ngAfterViewInit() {
    console.log(this.selectEle)

    this.position.x = this.selectEle.nativeElement.offsetLeft;
    this.position.y = this.selectEle.nativeElement.offsetTop;
  }
}
