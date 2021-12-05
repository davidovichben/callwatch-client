import { Component, ViewChild } from '@angular/core';

import { DataTableComponent } from 'src/app/_shared/components/data-table/data-table.component';

import { NotificationService } from 'src/app/_shared/services/generic/notification.service';
import { AcdService } from 'src/app/_shared/services/http/acd.service';
import { UserSessionService } from 'src/app/_shared/services/state/user-session.service';

@Component({
	selector: 'app-acds',
	templateUrl: './acds.component.html'
})
export class AcdsComponent {

	@ViewChild(DataTableComponent, { static: true }) dataTable: DataTableComponent;

  readonly columns = [
    { label: 'group_name', name: 'name' },
    { label: 'group_number', name: 'number' },
    { label: 'group_type', name: 'type' },
    { label: 'unit', name: 'unit' }
  ];

	constructor(private notification: NotificationService,
              private acdService: AcdService,
              public userSession: UserSessionService) {}

	fetchItems(): void {
		this.acdService.getAcds(this.dataTable.criteria).then(response => {
			this.dataTable.setItems(response);
		});
	}

	deleteItem(acdId: number): void {
		this.notification.warning().then(confirmation => {
			if (confirmation.value) {
				this.acdService.deleteAcd(acdId).then(() => {
					this.notification.success();
					this.fetchItems();
				});
			}
		});
	}
}
