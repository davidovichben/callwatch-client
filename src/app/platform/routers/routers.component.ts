import { Component, ViewChild } from '@angular/core';

import { DataTableComponent } from 'src/app/_shared/components/data-table/data-table.component';

import { NotificationService } from 'src/app/_shared/services/generic/notification.service';
import { RouterService } from 'src/app/_shared/services/http/router.service';
import { UserSessionService } from 'src/app/_shared/services/state/user-session.service';

@Component({
	selector: 'app-routers',
	templateUrl: './routers.component.html'
})
export class RoutersComponent {

	@ViewChild(DataTableComponent, { static: true }) dataTable: DataTableComponent;

	readonly columns = [
		{ name: 'name', label: 'name' }
	];

	constructor(private notification: NotificationService,
              private routerService: RouterService,
              public userSession: UserSessionService) {}

	fetchItems(): void {
		this.routerService.getRouters(this.dataTable.criteria).then(response => {
			this.dataTable.setItems(response);
		});
	}

	deleteItem(routerId: number): void {
		this.notification.warning().then(confirmation => {
			if (confirmation.value) {
				this.routerService.deleteRouter(routerId).then(() => {
					this.notification.success();
					this.fetchItems();
				});
			}
		});
	}
}
