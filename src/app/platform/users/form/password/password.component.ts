import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html'
})
export class PasswordComponent {

  constructor(private dialogRef: MatDialogRef<PasswordComponent>) {}

  submit(password: string): void {
    this.dialogRef.close(password);
  }
}
