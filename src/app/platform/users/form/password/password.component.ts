import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogClose, MatDialogRef } from '@angular/material/dialog';
import { SetPasswordModule } from '../../../../_shared/components/set-password/set-password.module';
import { TranslateModule } from '../../../../_shared/pipes/translate/translate.module';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  imports: [
    SetPasswordModule,
    TranslateModule,
    MatDialogClose
  ],
  standalone: true
})
export class PasswordComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public password: string, private dialogRef: MatDialogRef<PasswordComponent>) {}

  submit(password: string): void {
    this.dialogRef.close(password);
  }
}
