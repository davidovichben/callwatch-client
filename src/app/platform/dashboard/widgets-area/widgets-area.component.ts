import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

import { NgxResizeHandleType } from 'ngx-drag-resize';


@Component({
  selector: 'app-widgets-area',
  templateUrl: './widgets-area.component.html',
  styleUrls: ['./widgets-area.component.scss']
})
export class WidgetsAreaComponent implements AfterViewInit {

  @ViewChild('gridArea') gridEl: ElementRef;

  readonly handleType = NgxResizeHandleType;

  readonly tiles = new Array(56)

  readonly TILES_IN_ROW_COUNT = 7;
  readonly TILES_IN_COL_COUNT = 8;

  occupiedTiles = [];

  resizing = false;

  tileWidth: number;
  tileHeight: number;

  prevLocation = { offsetTop: 0, offsetLeft: 0, offsetWidth: 0, offsetHeight: 0 };

  widgets = [{
      type: 'doughnut',
      left: 185.38,
      width: 358.89,
      height: 278.003,
      color: 'green',
      position: 'absolute',
      top: 0.6,
      zindex: 1
    },
    {
      type: 'bar',
      left: 248.316,
      width: 433.333,
      height: 288.333,
      color: '#bb1a1b',
      position: 'absolute',
      top: 0.6,
      zindex: 1
    }];

  constructor() {
    this.occupiedTiles = this.buildGrid();
  }

  ngAfterViewInit(): void {
    const dropAreaEl = this.gridEl.nativeElement;
    const width = dropAreaEl.offsetWidth;
    const height = dropAreaEl.offsetHeight;

    this.tileWidth = width / this.TILES_IN_COL_COUNT;
    this.tileHeight = height / this.TILES_IN_ROW_COUNT;
  }

  buildGrid(): any {
    return Array(this.TILES_IN_ROW_COUNT).fill(null)
      .map(() => Array(this.TILES_IN_COL_COUNT).fill(null))
  }

  startDrag(element: HTMLDivElement, index: number): void {
    this.widgets[index].zindex++;

    this.widgets.map((el, elIndex) => {
      el.zindex = elIndex === index ? 2 : 1;
      return el;
    })

    this.prevLocation.offsetLeft = element.offsetLeft;
    this.prevLocation.offsetTop = element.offsetTop;
    this.prevLocation.offsetWidth = element.offsetWidth;
    this.prevLocation.offsetHeight = element.offsetHeight;
  }

  adjust(element: HTMLDivElement, index: number) {
    if (this.resizing) {
      this.adjustResize(element, index);
    }

    this.adjustLocation(element, index);
  }

  adjustLocation(element: HTMLDivElement | any, widgetIndex: number): void {
    const widget = this.widgets[widgetIndex];
    element = this.checkOverlap(element, widgetIndex) ? this.prevLocation : element;
    console.log(this.occupiedTiles)
    const elementValues = this.elementValues(element)

    console.log(this.resizing)
    const col = this.resizing ? elementValues.col + 1 : elementValues.col;
    const newTop = (elementValues.row * this.tileHeight) + 5;
    let newLeft = (col * this.tileWidth);
    newLeft = (col * this.tileWidth) + 1;

    widget.left = newLeft;
    widget.top = newTop;

    setTimeout(() => {
      widget.top = newTop - 1;
      widget.left = newLeft - 6;
    })

    this.resizing = false;
  }

  checkOverlap(element: HTMLDivElement, widgetIndex: number): boolean {
    const elementValues = this.elementValues(element)
    let overlap = false;

    const tempTilesGrid = this.buildGrid();
    for (let row = 0; row < this.TILES_IN_ROW_COUNT; row++) {
      for (let col = 0; col < this.TILES_IN_COL_COUNT; col++) {
        tempTilesGrid[row][col] = this.occupiedTiles[row][col];
        const tileContent = this.occupiedTiles[row][col];

        if (col >= elementValues.col && col < elementValues.col + elementValues.width && row >= elementValues.row && row < elementValues.row + elementValues.height) {
          if (tileContent !== null && tileContent != widgetIndex) {
            console.log(row, col)
            overlap = true
          }

          this.occupiedTiles[row][col] = widgetIndex;
        }

        if (tileContent == widgetIndex) {
          this.occupiedTiles[row][col] = null;
        }
      }
    }

    if (overlap) {
      this.occupiedTiles = tempTilesGrid;
    }

    return overlap;
  }

  //todo add model
  elementValues(element): any {
    return {
      row: Math.floor(element.offsetTop / this.tileHeight),
      col: Math.floor(element.offsetLeft / this.tileWidth),
      width: Math.round(element.offsetWidth / this.tileWidth),
      height: Math.round(element.offsetHeight / this.tileHeight)
    }
  }

  adjustResize(element: HTMLDivElement, index: number): void {
    const widget = this.widgets[index];
    const elementValues = this.elementValues(element)

    const newWidth = elementValues.width * this.tileWidth;
    const newHeight = elementValues.height * this.tileHeight;

    widget.width = newWidth;
    widget.height = newHeight;

    setTimeout(() => {
      widget.width = newWidth - 11;
      widget.height = newHeight - 11;
    })
  }
}
