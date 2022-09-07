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
    const data = { schedules: this.schedules }
    this.dataTable.openMultipleEditDialog(MultipleEditComponent, data)
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
