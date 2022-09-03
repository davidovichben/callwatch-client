import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { DataTableComponent } from 'src/app/_shared/components/data-table/data-table.component';
import { MultipleEditComponent } from './multiple-edit/multiple-edit.component';

import { NotificationService } from 'src/app/_shared/services/generic/notification.service';
import { CallbackService } from 'src/app/_shared/services/http/callback.service';
import { UserSessionService } from 'src/app/_shared/services/state/user-session.service';

import { SelectItemModel } from 'src/app/_shared/models/select-item.model';

import { TranslatePipe } from 'src/app/_shared/pipes/translate/translate.pipe';

@Component({
	selector: 'app-callbacks',
	templateUrl: './callbacks.component.html'
})
export class CallbacksComponent implements OnInit, OnDestroy {

	@ViewChild(DataTableComponent, { static: true }) dataTable: DataTableComponent;

  readonly sub = new Subscription();

  readonly columns = [
		{ name: 'name', label: 'callback_name' },
    { name: 'schedule', label: 'schedule' },
  ];

  schedules: SelectItemModel[] = [];

  constructor(private notification: NotificationService, private callbackService: CallbackService,
              private dialog: MatDialog, public userSession: UserSessionService,
              private t: TranslatePipe, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.schedules = this.route.snapshot.data.schedules;
  }

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

    const dialog = this.dialog.open(MultipleEditComponent, {
      data: {
        checkedItems,
        schedules: this.schedules
      },
      width: '600px'
    })

    const sub = dialog.afterClosed().subscribe(updated => {
      if (updated) {
        this.fetchItems();
        this.dataTable.criteria.checkedItems = [];
        this.notification.success()
      }
    });

    this.sub.add(sub);
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

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
