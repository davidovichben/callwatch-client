import { Component, EventEmitter, Input, Output } from '@angular/core';

import { NotificationService } from 'src/app/_shared/services/generic/notification.service';

import { TranslatePipe } from 'src/app/_shared/pipes/translate/translate.pipe';

@Component({
  selector: 'app-checked-items',
  templateUrl: './checked-items.component.html',
  styleUrls: ['./checked-items.component.sass']
})
export class CheckedItemsComponent {

  @Input() checkedItems: any[]
  @Output() itemRemoved = new EventEmitter();

  constructor (private notifications: NotificationService, private t: TranslatePipe) {
  }

  removeItem(index: number): void {
    if (this.checkedItems.length === 1) {
      this.notifications.error(this.t.transform('error_last_item'))
      return;
    }

    this.checkedItems.splice(index, 1);
    this.itemRemoved.emit(this.checkedItems)
  }
}
