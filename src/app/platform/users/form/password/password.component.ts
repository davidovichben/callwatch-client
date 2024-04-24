import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html'
})
export class PasswordComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public password: string, private dialogRef: MatDialogRef<PasswordComponent>) {}

  submit(password: string): void {
    this.dialogRef.close(password);
  }
}
