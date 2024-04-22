import { Component, Inject, OnInit } from '@angular/core';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';

import { TranslatePipe } from 'src/app/_shared/pipes/translate/translate.pipe';

import { Fade } from 'src/app/_shared/constants/animations';

@Component({
  selector: 'app-columns-dialog',
  templateUrl: './columns-dialog.component.html',
  animations: [Fade]
})
export class ColumnsDialogComponent implements OnInit {

  formattedColumns = [];

  hasColumnsError = false;

  constructor(private dialogRef: MatDialogRef<ColumnsDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public columns,
              private t: TranslatePipe) {}

  ngOnInit(): void {
    this.formattedColumns = this.columns.available.map(column => {
      const name = column.level ? this.t.transform('level') + ' ' + column.level : this.t.transform(column.name);
      return { id: column.id, name };
    });
  }

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
