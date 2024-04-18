import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

import { ErrorMessages } from 'src/app/_shared/constants/error-messages';
import { Fade } from 'src/app/_shared/constants/animations';

@Component({
  selector: 'app-set-password',
  templateUrl: './set-password.component.html',
  animations: [Fade]
})
export class SetPasswordComponent implements OnInit {

  @Input() password: string;

  @Output() submitted = new EventEmitter();

  readonly errorMessages = ErrorMessages;

  passwordForm: UntypedFormGroup;

  showPassword: boolean;
  showRepeatPassword: boolean;

  constructor(private fb: UntypedFormBuilder) {}

  ngOnInit() {
    this.passwordForm = this.fb.group({
      password: this.fb.control(this.password, Validators.required),
      repeatPassword: this.fb.control(this.password, Validators.required)
    });

    this.passwordForm.setValidators(this.comparePasswords.bind(this));
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
