import { Component, ElementRef, forwardRef, Input, OnInit, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { SelectItemModel } from 'src/app/_shared/models/select-item.model';

@Component({
  selector: 'app-dual-groups-select',
  templateUrl: './dual-groups-select.component.html',
  styleUrls: ['./dual-groups-select.component.styl'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => DualGroupsSelectComponent),
    }
  ]
})
export class DualGroupsSelectComponent implements OnInit, ControlValueAccessor {

  @ViewChild('selectedSearch') selectedSearch: ElementRef;

  @Input() items: SelectItemModel[];
  @Input() placeholder = 'items';

  availableItems = [];

  selectedItems = {
    all: [],
    filtered: []
  };

  ngOnInit() {
    this.availableItems = [...this.items];
  }

  addItems(): void {
    const addedItems = this.availableItems.filter(item => item.selected);
    this.availableItems = [...this.availableItems.filter(item => !item.selected)];

    addedItems.forEach(item => {
      const newItem = { ...item };
      newItem.selected = false;
      this.selectedItems.all.push(newItem);
    });

    this.setSelectedItems();

    this.propagateChange(this.selectedItems.all.map(item => item.id));
  }

  removeItems(): void {
    const removedItems = this.selectedItems.all.filter(item => item.selected);
    this.selectedItems.all = [...this.selectedItems.all.filter(item => !item.selected)];

    removedItems.forEach(item => {
      const newItem = { ...item };
      newItem.selected = false;
      this.availableItems.push(newItem);
    });

    this.setSelectedItems();

    this.propagateChange(this.selectedItems.all.map(item => item.id));
  }

  private setSelectedItems(): void {
    this.selectedItems.filtered = this.selectedItems.all;

    const searchValue = this.selectedSearch?.nativeElement.value;
    if (searchValue) {
      this.search(searchValue, 'selectedItems');
    }
  }

  search(keyword: string, type: string, event?: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.cancelBubble = true;
      event.returnValue = false;

      if (event.stopPropagation) {
        event.stopPropagation();
        event.preventDefault();
      }
    }

    const items = type === 'available' ? this.items : this.selectedItems.all;
    if (type === 'available') {
      this.availableItems = items.filter(item => item.name.indexOf(keyword) !== -1);
    } else {
      this.selectedItems.filtered = items.filter(item => item.name.indexOf(keyword) !== -1);
    }
  }

  resetSearch(keywordEle: HTMLInputElement, type: string): void {
    keywordEle.value = null;

    if (type === 'available') {
      this.availableItems = this.items;
    } else {
      this.selectedItems.filtered = this.selectedItems.all;
    }
  }

  private propagateChange = (_: any) => {};

  writeValue(values: number[]): void {
    if (!values) {
      return;
    }

    const selectedItems = this.availableItems.filter(item => {
      return values.indexOf(item.id) !== -1;
    })

    selectedItems.forEach(item => item.selected = true);

    this.addItems();
  }

  registerOnChange(fn: any) {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {

  }
}
