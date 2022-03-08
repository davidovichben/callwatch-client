import { Component, ViewChild } from '@angular/core';

import { DataTableComponent } from 'src/app/_shared/components/data-table/data-table.component';

import { NotificationService } from 'src/app/_shared/services/generic/notification.service';
import { CallbackService } from 'src/app/_shared/services/http/callback.service';
import { UserSessionService } from 'src/app/_shared/services/state/user-session.service';

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
              public userSession: UserSessionService) {}

	fetchItems(): void {
		this.callbackService.getCallbacks(this.dataTable.criteria).then(response => {
			this.dataTable.setItems(response);
		});
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
