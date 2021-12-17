import { Component, ViewChild } from '@angular/core';

import { DataTableComponent } from 'src/app/_shared/components/data-table/data-table.component';

import { NotificationService } from 'src/app/_shared/services/generic/notification.service';
import { RouterService } from 'src/app/_shared/services/http/router.service';
import { UserSessionService } from 'src/app/_shared/services/state/user-session.service';

import { TranslatePipe } from 'src/app/_shared/pipes/translate/translate.pipe';

import { RouterModel } from 'src/app/_shared/models/router.model';

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
              public userSession: UserSessionService,
              private t: TranslatePipe) {}

	fetchItems(): void {
		this.routerService.getRouters(this.dataTable.criteria).then(response => {
			this.dataTable.setItems(response);
		});
	}

  duplicateItem(router: RouterModel): void {
    const msg = this.t.transform('duplicate_router') + ' "' + router.name + '"?';
    this.notification.warning(msg).then(confirmation => {
      if (confirmation.value) {
        this.routerService.duplicateRouter(router.id).then(response => {
          if (response) {
            this.fetchItems();
            this.notification.success();
          }
        });
      }
    });
  }

	deleteItem(router: RouterModel): void {
    const msg = this.t.transform('delete_router') + ' "' + router.name + '"?';
    this.notification.warning(msg).then(confirmation => {
			if (confirmation.value) {
				this.routerService.deleteRouter(router.id).then(() => {
					this.notification.success();
					this.fetchItems();
				});
			}
		});
	}
}
