import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ErrorMessages } from 'src/app/_shared/constants/error-messages';

@Component({
  selector: 'app-set-password',
  templateUrl: './set-password.component.html'
})
export class SetPasswordComponent implements OnInit {

  @Output() submitted = new EventEmitter();

  readonly errorMessages = ErrorMessages;

  passwordForm: FormGroup;

  showPassword: boolean;
  showRepeatPassword: boolean;

  constructor(private fb: FormBuilder) {}

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
      const password = this.passwordForm.get('password').value;
      this.submitted.emit(password);
    }
  }
}
