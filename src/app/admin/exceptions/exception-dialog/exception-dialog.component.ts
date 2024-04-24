import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ExceptionModel } from 'src/app/_shared/models/exception.model';

@Component({
  selector: 'app-exception-dialog',
  templateUrl: './exception-dialog.component.html',
  styleUrls: ['./exception.dialog.component.sass']
})
export class ExceptionDialogComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public exception: ExceptionModel) {}
}
