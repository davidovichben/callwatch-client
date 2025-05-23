import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

import { MailboxService } from 'src/app/_shared/services/http/mailbox.service';

import { EmailPattern } from 'src/app/_shared/constants/patterns';
import { ErrorMessages } from 'src/app/_shared/constants/error-messages';
import { isInteger } from 'src/app/_shared/validators/integer.validator';

@Component({
  selector: 'app-multiple-edit',
  templateUrl: './multiple-edit.component.html',
  styleUrls: ['../../../../_shared/components/multiple-edit/multiple-edit.component.sass']
})
export class MultipleEditComponent implements OnInit {

  readonly errorMessages = ErrorMessages;

  formGroup: UntypedFormGroup;

  checkedItems: any[]

  selects = {
    extensions: [],
    types: [],
    switchboards: [],
    callbacks: [],
    routers: []
  };

  isSubmitting = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private fb: UntypedFormBuilder,
              private dialogRef: MatDialogRef<MultipleEditComponent>,
              private mailboxService: MailboxService) {}

  ngOnInit(): void {
    this.checkedItems = this.data.checkedItems;
    this.selects = this.data.selects;

    this.formGroup = this.fb.group({
      type: this.fb.control(null),
      callback: this.fb.control(null),
      router: this.fb.control(null),
      overflowNumber: this.fb.control(null, isInteger),
      email: this.fb.control(null, Validators.pattern(EmailPattern)),
      dialerCallerID: this.fb.control(null),
      forceEmpty: this.fb.control(null)
    })
  }

  submit(): void {
    if (this.formGroup.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      this.mailboxService.multipleUpdate(this.checkedItems, this.formGroup.value).then(response => {
        this.isSubmitting = false;

        if (response) {
          this.dialogRef.close(response)
        }
      });
    }
  }
}
