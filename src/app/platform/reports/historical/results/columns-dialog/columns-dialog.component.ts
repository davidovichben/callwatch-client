import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Fade } from 'src/app/_shared/constants/animations';

@Component({
  selector: 'app-columns-dialog',
  templateUrl: './columns-dialog.component.html',
  animations: [Fade]
})
export class ColumnsDialogComponent {

  hasColumnsError = false;

  constructor(private dialogRef: MatDialogRef<ColumnsDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public columns) {}

  submit(currentColumns: number[]): void {
    this.hasColumnsError = false;

    let output = null;

    if (currentColumns.length === 0) {
      this.hasColumnsError = true;
      return;
    }

    const previousColumns = this.columns.selected;
    if (JSON.stringify(currentColumns) !== JSON.stringify(previousColumns)) {
      output = currentColumns;
      this.columns.available.forEach(column => column.selected = false);
    }

    this.dialogRef.close(output)
  }
}
