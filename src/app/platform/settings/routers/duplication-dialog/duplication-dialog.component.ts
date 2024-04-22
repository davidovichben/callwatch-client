import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';

import { GenericService } from 'src/app/_shared/services/http/generic.service';

import { ErrorMessages } from 'src/app/_shared/constants/error-messages';

@Component({
  selector: 'app-duplication-dialog',
  templateUrl: './duplication-dialog.component.html'
})
export class DuplicationDialogComponent implements OnInit {

  readonly errorMessages = ErrorMessages;

  formGroup: UntypedFormGroup;

  constructor(private genericService: GenericService, private fb: UntypedFormBuilder,
              private dialogRef: MatDialogRef<DuplicationDialogComponent>) {}

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      name: this.fb.control(null, Validators.required, this.checkNameExists.bind(this))
    });
  }

  checkNameExists(control: UntypedFormControl): Promise<object> {
    return this.genericService.exists('router', control.value).then(response => {
      if (response) {
        return response.exists ? { exists: true } : null;
      }

      return null;
    })
  }

  submit(): void {
    if (this.formGroup.valid) {
      this.dialogRef.close(this.formGroup.get('name').value);
    }
  }
}
