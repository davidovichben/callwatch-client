import { Component, OnDestroy, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';

import { DataTableComponent } from 'src/app/_shared/components/data-table/data-table.component';

import { NotificationService } from 'src/app/_shared/services/generic/notification.service';
import { RouterService } from 'src/app/_shared/services/http/router.service';
import { UserSessionService } from 'src/app/_shared/services/state/user-session.service';

import { TranslatePipe } from 'src/app/_shared/pipes/translate/translate.pipe';

import { RouterModel } from 'src/app/_shared/models/router.model';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { DuplicationDialogComponent } from './duplication-dialog/duplication-dialog.component';

@Component({
	selector: 'app-routers',
	templateUrl: './routers.component.html'
})
export class RoutersComponent implements OnDestroy {

	@ViewChild(DataTableComponent, { static: true }) dataTable: DataTableComponent;

  readonly sub = new Subscription();

	readonly columns = [
		{ name: 'name', label: 'name' },
    { name: 'schedule', label: 'schedule' },
    { name: 'numbers', label: 'dialed_numbers' }
  ];

	constructor(private notification: NotificationService,
              private routerService: RouterService,
              private dialog: MatDialog, private t: TranslatePipe,
              public userSession: UserSessionService) {}

	fetchItems(): void {
		this.routerService.getRouters(this.dataTable.criteria).then(response => {
			this.dataTable.setItems(response);
		});
	}

  duplicateItem(router: RouterModel): void {
    const dialog = this.dialog.open(DuplicationDialogComponent, {
      width: '400px'
    });

    const sub = dialog.afterClosed().subscribe(name => {
      if (name) {
        this.routerService.duplicateRouter(router.id, name).then(response => {
          if (response) {
            this.fetchItems();
            this.notification.success();
          }
        });
      }
    })

    this.sub.add(sub);
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

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
