import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { ExceptionDialogComponent } from 'src/app/admin/exceptions/exception-dialog/exception-dialog.component';
import { DataTableComponent } from 'src/app/_shared/components/data-table/data-table.component';

import { ExceptionsService } from 'src/app/_shared/services/http/exceptions.service';
import { NotificationService } from 'src/app/_shared/services/generic/notification.service';

import { ExceptionModel } from 'src/app/_shared/models/exception.model';

@Component({
  selector: 'app-exceptions',
  templateUrl: './exceptions.component.html'
})
export class ExceptionsComponent {

  @ViewChild(DataTableComponent, { static: true }) dataTable: DataTableComponent;

  readonly columns = [
    { label: 'username', name: 'username' },
    { label: 'code', name: 'code' },
    { label: 'path', name: 'path' },
    { label: 'line', name: 'line' },
    { label: 'url', name: 'url' },
    { label: 'created_at', name: 'createdAt' }
  ];

  constructor(private router: Router, private exceptionService: ExceptionsService,
              private notifications: NotificationService, private dialog: MatDialog) {}

  fetchItems(): void {
    const criteria = this.dataTable.criteria;

    this.exceptionService.getExceptions(criteria).then(response => {
      this.dataTable.setItems(response);
    });
  }

  openExceptionDialog(exception: ExceptionModel): void {
    this.dialog.open(ExceptionDialogComponent, {
      width: '800px',
      data: exception
    });
  }

  deleteItem(exceptionId: number): void {
    this.notifications.warning().then(confirmation => {
      if (confirmation.value) {
        this.exceptionService.deleteException(exceptionId).then(response => {
          if (response) {
            this.notifications.success();
            this.fetchItems();
          }
        })
      }
    });
  }
}
