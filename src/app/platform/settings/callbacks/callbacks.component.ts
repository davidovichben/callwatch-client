import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { DataTableComponent } from 'src/app/_shared/components/data-table/data-table.component';
import { MultipleEditComponent } from './multiple-edit/multiple-edit.component';

import { NotificationService } from 'src/app/_shared/services/generic/notification.service';
import { CallbackService } from 'src/app/_shared/services/http/callback.service';
import { UserSessionService } from 'src/app/_shared/services/state/user-session.service';

import { SelectItemModel } from 'src/app/_shared/models/select-item.model';

@Component({
	selector: 'app-callbacks',
	templateUrl: './callbacks.component.html'
})
export class CallbacksComponent implements OnInit {

	@ViewChild(DataTableComponent, { static: true }) dataTable: DataTableComponent;

  readonly columns = [
		{ name: 'name', label: 'callback_name' },
    { name: 'schedule', label: 'schedule' }
  ];

  schedules: SelectItemModel[] = [];

  constructor(private notification: NotificationService, private callbackService: CallbackService,
              public userSession: UserSessionService, private route: ActivatedRoute) {}

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
}
