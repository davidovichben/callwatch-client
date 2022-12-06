import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-query-dialog',
  templateUrl: './query-dialog.component.html'
})
export class QueryDialogComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public query: string) {}
}
