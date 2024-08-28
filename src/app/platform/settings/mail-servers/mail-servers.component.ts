import { Component, ViewChild } from '@angular/core';

import { DataTableComponent } from 'src/app/_shared/components/data-table/data-table.component';

import { NotificationService } from 'src/app/_shared/services/generic/notification.service';
import { MailServerService } from 'src/app/_shared/services/http/mail-server.service';
import { UserSessionService } from 'src/app/_shared/services/state/user-session.service';

@Component({
	selector: 'app-mail-servers',
	templateUrl: './mail-servers.component.html'
})
export class MailServersComponent {

	@ViewChild(DataTableComponent, { static: true }) dataTable: DataTableComponent;

	readonly columns = [
		{ name: 'domain', label: 'domain' }
  ];

	constructor(private notification: NotificationService,
        public userSession: UserSessionService,
				private mailServerService: MailServerService) {}

	async fetchItems(): Promise<void> {
		const response = await this.mailServerService.getMailServers(this.dataTable.criteria);
		this.dataTable.setItems(response);
	}

	async deleteItem(mailServerId: string): Promise<void> {
		const confirmation = await this.notification.warning();
		if (confirmation.value) {
			await this.mailServerService.deleteMailServer(mailServerId);
			this.notification.success();
			await this.fetchItems();
		}
	}
}
