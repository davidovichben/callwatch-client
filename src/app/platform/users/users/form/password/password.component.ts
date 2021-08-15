import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

import { ErrorMessages } from 'src/app/_shared/constants/error-messages';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html'
})
export class PasswordComponent implements OnInit {

  readonly errorMessages = ErrorMessages;

  passwordForm: FormGroup;

  constructor(private fb: FormBuilder,
              private dialogRef: MatDialogRef<PasswordComponent>) {}

  ngOnInit() {
    this.passwordForm = this.fb.group({
      password: this.fb.control(null, Validators.required),
      repeatPassword: this.fb.control(null)
    });

    this.setValidators();
  }

  private setValidators(): void {
    this.passwordForm.get('repeatPassword').setValidators([Validators.required, this.comparePasswords.bind(this)]);
  }

  private comparePasswords(): object {
    if (this.passwordForm.get('password').value !== this.passwordForm.get('repeatPassword').value) {
      return { compare: true };
    }

    return {};
  }


  submit(): void {
    if (this.passwordForm.valid) {
      this.dialogRef.close(this.passwordForm.get('password').value);
    }
  }
}
