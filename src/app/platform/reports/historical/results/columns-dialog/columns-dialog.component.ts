import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { SelectItemModel } from 'src/app/_shared/models/select-item.model';

@Component({
  selector: 'app-columns-dialog',
  templateUrl: './columns-dialog.component.html'
})
export class ColumnsDialogComponent {

  constructor(private dialogRef: MatDialogRef<ColumnsDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public columns) {}

  submit(currentColumns: number[]): void {
    let output = null;

    const previousColumns = this.columns.selected;
    if (JSON.stringify(currentColumns) !== JSON.stringify(previousColumns)) {
      output = currentColumns;
      this.columns.available.forEach(column => column.selected = false);
    }

    this.dialogRef.close(output)
  }
}
