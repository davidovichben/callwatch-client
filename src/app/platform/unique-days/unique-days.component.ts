import { Component, ViewChild } from '@angular/core';

import { DataTableComponent } from 'src/app/_shared/components/data-table/data-table.component';

import { NotificationService } from 'src/app/_shared/services/generic/notification.service';
import { UserSessionService } from 'src/app/_shared/services/state/user-session.service';
import { UniqueDayService } from 'src/app/_shared/services/http/unique-day.service';

@Component({
	selector: 'app-uniquedays',
	templateUrl: './unique-days.component.html'
})
export class UniqueDaysComponent {

	@ViewChild(DataTableComponent, { static: true }) dataTable: DataTableComponent;

	readonly columns = [
		{ name: 'name', label: 'name' },
    { name: 'description', label: 'description' }
  ];

	constructor(private notification: NotificationService,
				private uniqueDayService: UniqueDayService,
        public userSession: UserSessionService) {}

	fetchItems(): void {
		this.uniqueDayService.getUniqueDays(this.dataTable.criteria).then(response => {
			this.dataTable.setItems(response);
		});
	}
}
