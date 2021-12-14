import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { SelectItemModel } from 'src/app/_shared/models/select-item.model';

@Component({
  selector: 'app-select-groups',
  templateUrl: './select-groups.component.html',
  styleUrls: ['./select-groups.component.styl'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => SelectGroupsComponent),
    }
  ]
})
export class SelectGroupsComponent implements OnInit, ControlValueAccessor {

  @Input() items: SelectItemModel[];
  @Input() placeholderKeyword: string;

  filteredItems = [];
  selectedItems = [];

  ngOnInit() {
    this.filteredItems = this.items;
  }

  addItems(): void {
    const existingItems = this.selectedItems.map(item => item.id);
    const addedItems = this.filteredItems.filter(item => item.checked && existingItems.indexOf(item.id) === -1);

    addedItems.forEach(item => {
      const newItem = { ...item };
      newItem.checked = false;
      this.selectedItems.push(newItem);
    });

    this.propagateChange(this.selectedItems.map(item => item.id));
  }

  removeItems(): void {
    this.selectedItems.forEach((selectedItem, index) => {
      if (selectedItem.checked) {
        this.selectedItems.splice(index, 1);
        this.filteredItems.find(item => item.id === selectedItem.id).checked = false;
      }
    });

    this.propagateChange(this.selectedItems.map(item => item.id));
  }

  search(keyword: string): void {
    this.filteredItems = this.items.filter(item => item.name.indexOf(keyword) !== -1);
  }

  resetSearch(keywordEle: HTMLInputElement): void {
    keywordEle.value = null;
    this.filteredItems = this.items;
  }

  private propagateChange = (_: any) => {};

  writeValue(values: number[]): void {
    if (!values) {
      return;
    }

    const selectedItems = this.filteredItems.filter(item => {
      return values.indexOf(item.id) !== -1;
    })

    selectedItems.forEach(item => item.checked = true);

    this.addItems();
  }

  registerOnChange(fn: any) {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {

  }
}
