import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { ErrorMessages } from 'src/app/_shared/constants/error-messages';
import { DataTypes, ReportColumnModel, TotalTypes } from 'src/app/_shared/models/report-column.model';

@Component({
  selector: 'app-column-settings',
  templateUrl: './column-settings.component.html'
})
export class ColumnSettingsComponent {

  readonly errorMessages = ErrorMessages;
  readonly totalTypes = TotalTypes;
  readonly dataTypes = DataTypes;

  formGroup: FormGroup;

  constructor(private fb: FormBuilder, private dialogRef: MatDialogRef<ColumnSettingsComponent>,
              @Inject(MAT_DIALOG_DATA) private column: ReportColumnModel) {}

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      name: this.fb.control(null, Validators.required),
      description: this.fb.control(null),
      title: this.fb.control(null),
      subTitle: this.fb.control(null),
      totalType: this.fb.control('SUM', Validators.required),
      dataType: this.fb.control('percent', Validators.required),
      showExternal: this.fb.control(false),
      showInternal: this.fb.control(false),
    });

    this.formGroup.patchValue(this.column);
  }

  submit(): void {
    if (this.formGroup.valid) {
      this.dialogRef.close(this.formGroup.value);
    }
  }
}
