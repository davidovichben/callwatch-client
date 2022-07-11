import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { NgxDrag, NgxResize, NgxResizeHandleType } from 'ngx-drag-resize';

@Component({
  selector: 'app-widgets-area',
  templateUrl: './widgets-area.component.html',
  styleUrls: ['./widgets-area.component.scss']
})
export class WidgetsAreaComponent implements AfterViewInit {

  public style: object = {};
  readonly handleType = NgxResizeHandleType;

  readonly tiles = new Array(56)

  @ViewChild('dragResizeArea') gridEl: ElementRef;

  elementOffsetLeft: number;

  resizing = false;

  readonly TILES_IN_ROW_COUNT = 8;
  readonly TILES_IN_COL_COUNT = 7;

  tileWidth: number;
  tileHeight: number;

  widgets = [
    {
      type: 'doughnut',
      left: 185.38,
      width: 358.89,
      height: 278.003,
      top: 95
    },
    {
      type: 'bar',
      left: 248.316,
      width: 433.333,
      height: 288.333,
      top: 180
    }
  ];

  ngAfterViewInit() {
    const dropAreaEl = this.gridEl.nativeElement;
    const width = dropAreaEl.offsetWidth;
    const height = dropAreaEl.offsetHeight;

    this.tileWidth = width / this.TILES_IN_ROW_COUNT;
    this.tileHeight = height / this.TILES_IN_COL_COUNT;

    console.log(this.tileWidth);
  }

  resized(event: NgxResize, element: HTMLDivElement, index: number): void {
    this.elementOffsetLeft = element.offsetLeft

    this.resizing = true;
    this.widgets[index].height = element.offsetHeight;
    this.widgets[index].width = element.offsetWidth + 10;
  }

  dragged(event: NgxDrag, index: number): void {
  }

  startDrag(element: HTMLDivElement): void {
    // this.elementOffsetLeft = element.offsetLeft
    // console.log(elementRef.offsetLeft)
  }

  drag(ev, el) {
    // console.log(el.getBoundingClientRect)
    // ev.dataTransfer.setData("text", ev.target.id);
  }

  drop(element: HTMLDivElement, index) {
    console.log('dropped')
    if (this.resizing) {
      this.resizing = false;
      return;
    }

    this.elementOffsetLeft = element.offsetLeft

    console.log((Math.floor(element.offsetLeft / 185.38)))
    console.log(Math.floor(element.offsetTop / 95))
    this.widgets[index].left = ((Math.floor(element.offsetLeft / 185.38)) * 185.38) - 2;
    this.widgets[index].top = (Math.floor(element.offsetTop / 95)) * 95;
    console.log(this.widgets[index])

  }

  allowDrop(ev) {
    // ev.preventDefault();
  }

  saveCoords(elementRef) {
    this.elementOffsetLeft = elementRef.offsetLeft
  }

}
