import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-checked-items',
  templateUrl: './checked-items.component.html',
  styleUrls: ['./checked-items.component.styl']
})
export class CheckedItemsComponent {

  @Input() checkedItems: any[]
  @Output() itemRemoved = new EventEmitter();

  removeItem(index: number): void {
    this.checkedItems.splice(index, 1);
    this.itemRemoved.emit(this.checkedItems)
  }
}
