import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ErrorMessages } from 'src/app/_shared/constants/error-messages';
import { AuthTypes } from 'src/app/_shared/models/user.model';
import { Langs } from 'src/app/_shared/constants/general';
import { EmailPattern, PhonePattern } from 'src/app/_shared/constants/patterns';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html'
})
export class FormComponent implements OnInit {

  readonly authTypes = AuthTypes;
  readonly langs = Langs;
  readonly errorMessages = ErrorMessages;

  userForm: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.userForm = this.fb.group({
      firstName: this.fb.control(null, Validators.required),
      lastName: this.fb.control(null, Validators.required),
      workNumber: this.fb.control(null),
      email: this.fb.control(null, [Validators.required, Validators.pattern(EmailPattern)]),
      mobile: this.fb.control(null),
      phone: this.fb.control(null, Validators.pattern(PhonePattern)),
      authType: this.fb.control(null),
      username: this.fb.control(null, Validators.required)

    });
  }

  openPasswordDialog(): void {

  }

  submit(): void {

  }
}
