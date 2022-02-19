import { Component, ContentChild, ElementRef, forwardRef, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
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

  @ContentChild('row', { static: false }) rowTemplateRef: TemplateRef<any>;
  @ContentChild('selected', { static: false }) selectedTemplateRef: TemplateRef<any>;

  @Input() items: SelectItemModel[];
  @Input() placeholder = 'items';
  @Input() objectOutput = false;

  availableItems = [];

  selectedItems = {
    all: [],
    filtered: []
  };

  searchInputs = {
    available: null,
    selected: null
  }

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

    const selected = this.selectedItems.all;
    this.propagateChange(this.objectOutput ? selected : selected.map(item => item.id));
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

    const selected = this.selectedItems.all;
    this.propagateChange(this.objectOutput ? selected : selected.map(item => item.id));
  }

  private setSelectedItems(): void {
    this.selectedItems.filtered = this.selectedItems.all;
    if (this.searchInputs.selected) {
      this.search('selected');
    }
  }

  search(type: string, event?: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.cancelBubble = true;
      event.returnValue = false;

      if (event.stopPropagation) {
        event.stopPropagation();
        event.preventDefault();
      }
    }

    const items = type === 'available' ? this.items : this.selectedItems.all;
    const keyword = type === 'available' ? this.searchInputs.available : this.searchInputs.selected;
    if (type === 'available') {
      this.availableItems = items.filter(item => item.name.indexOf(keyword) !== -1);
    } else {
      this.selectedItems.filtered = items.filter(item => item.name.indexOf(keyword) !== -1);
    }
  }

  resetSearch(type: string): void {
    if (type === 'available') {
      this.availableItems = this.items;
      this.searchInputs.available = null;
    } else {
      this.selectedItems.filtered = this.selectedItems.all;
      this.searchInputs.selected = null;
    }
  }

  newItem(item: SelectItemModel, selected?: boolean): void {
    if (selected) {
      this.selectedItems.all.push(item);
    } else {
      this.availableItems.push(item);
    }

    const type = selected ? 'selected' : 'available';
    this.resetSearch(type);
  }

  reset(): void {
    this.selectedItems.filtered = [];
    this.selectedItems.all = [];
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
