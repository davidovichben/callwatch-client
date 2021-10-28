import { Component, ViewChild } from '@angular/core';

import { DataTableComponent } from 'src/app/_shared/components/data-table/data-table.component';

import { NotificationService } from 'src/app/_shared/services/generic/notification.service';
import { SwitchboardService } from 'src/app/_shared/services/http/switchboard.service';
import { UserSessionService } from 'src/app/_shared/services/state/user-session.service';

import { SwitchboardTypes } from 'src/app/_shared/models/switchboard.model';

@Component({
	selector: 'app-switchboards',
	templateUrl: './switchboards.component.html'
})
export class SwitchboardsComponent {

	@ViewChild(DataTableComponent, { static: true }) dataTable: DataTableComponent;

	readonly columns = [
		{ name: 'name', label: 'switchboard_name' },
    { name: 'type', label: 'switchboard_type' },
    { name: 'netAddress', label: 'net_address' }
  ];

  readonly types = SwitchboardTypes;

	constructor(private notification: NotificationService,
        public userSession: UserSessionService,
				private switchboardService: SwitchboardService) {}

	fetchItems(): void {
		this.switchboardService.getSwitchboards(this.dataTable.criteria).then(response => {
			this.dataTable.setItems(response);
		});
	}

	deleteItem(switchboardId: number): void {
		this.notification.warning().then(confirmation => {
			if (confirmation.value) {
				this.switchboardService.deleteSwitchboard(switchboardId).then(() => {
					this.notification.success();
					this.fetchItems();
				});
			}
		});
	}
}
