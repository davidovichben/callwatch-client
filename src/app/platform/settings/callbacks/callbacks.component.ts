import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { DataTableComponent } from 'src/app/_shared/components/data-table/data-table.component';
import { MultipleEditComponent } from './multiple-edit/multiple-edit.component';

import { NotificationService } from 'src/app/_shared/services/generic/notification.service';
import { CallbackService } from 'src/app/_shared/services/http/callback.service';
import { UserSessionService } from 'src/app/_shared/services/state/user-session.service';

import { TranslatePipe } from 'src/app/_shared/pipes/translate/translate.pipe';

@Component({
	selector: 'app-callbacks',
	templateUrl: './callbacks.component.html'
})
export class CallbacksComponent {

	@ViewChild(DataTableComponent, { static: true }) dataTable: DataTableComponent;

	readonly columns = [
		{ name: 'name', label: 'callback_name' },
    { name: 'schedule', label: 'schedule' },
  ];

	constructor(private notification: NotificationService, private callbackService: CallbackService,
              private dialog: MatDialog, public userSession: UserSessionService,
              private t: TranslatePipe) {}

	fetchItems(): void {
		this.callbackService.getCallbacks(this.dataTable.criteria).then(response => {
			this.dataTable.setItems(response);
		});
	}

  openMultipleEdit(): void {
    const checkedItems = this.dataTable.criteria.checkedItems;
    if (checkedItems.length === 0) {
      this.notification.error(this.t.transform('no_items_selected'));
      return;
    }

    this.dialog.open(MultipleEditComponent, {
      data: checkedItems,
      width: '600px'
    })
  }

	deleteItem(callbackId: number): void {
		this.notification.warning().then(confirmation => {
			if (confirmation.value) {
				this.callbackService.deleteCallback(callbackId).then(() => {
					this.notification.success();
					this.fetchItems();
				});
			}
		});
	}
}
