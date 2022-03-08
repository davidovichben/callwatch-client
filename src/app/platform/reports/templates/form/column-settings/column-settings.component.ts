import { Component, Inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { LocaleService } from 'src/app/_shared/services/state/locale.service';

import { ErrorMessages } from 'src/app/_shared/constants/error-messages';
import { DataTypes, TotalTypes } from 'src/app/_shared/models/report-column.model';
import { Operations } from 'src/app/_shared/constants/general';
import { SelectItemModel } from 'src/app/_shared/models/select-item.model';
import { Fade } from 'src/app/_shared/constants/animations';

@Component({
  selector: 'app-column-settings',
  templateUrl: './column-settings.component.html',
  styleUrls: ['./column.settings.component.styl'],
  animations: [Fade]
})
export class ColumnSettingsComponent {

  readonly errorMessages = ErrorMessages;
  readonly totalTypes = TotalTypes;
  readonly dataTypes = DataTypes;
  readonly operations = Operations;

  columnsById = {};

  formGroup: FormGroup;

  constructor(private fb: FormBuilder, private dialogRef: MatDialogRef<ColumnSettingsComponent>,
              public localeService: LocaleService,
              @Inject(MAT_DIALOG_DATA) public data) {}

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      name: this.fb.control(null, Validators.required),
      description: this.fb.control(null),
      title: this.fb.control(null),
      subTitle: this.fb.control(null),
      totalType: this.fb.control('sum', Validators.required),
      dataType: this.fb.control('percent', Validators.required),
      showExternal: this.fb.control(false),
      showInternal: this.fb.control(false),
    });

    if (this.data.columnType === 'computed') {
      this.formGroup.addControl('formula', this.fb.group({
        columns: this.fb.array([], Validators.required),
        operators: this.fb.array([])
      }))

      this.data.columns.forEach(column => this.columnsById[column.id] = column.name);
    }

    if (this.data.column) {
      if (this.data.columnType === 'computed') {
        this.setFormula();
      }

      this.formGroup.patchValue(this.data.column);
    }
  }

  private setFormula(): void {
    const formula = this.data.column.formula;

    formula.columns.forEach((column, index) => {
      (this.formGroup.get('formula.columns') as FormArray).push(this.fb.control(column));
      if (index > 0) {
        const operator = formula.operators[index - 1];
        (this.formGroup.get('formula.operators') as FormArray).push(this.fb.control(operator));
      }
    });
  }

  addColumn(column: SelectItemModel): void {
    const columns = this.formGroup.get('formula.columns') as FormArray;
    if (columns.length > 0) {
      const operators = (this.formGroup.get('formula.operators') as FormArray);
      operators.push(this.fb.control('+'));
    }

    columns.push(this.fb.control(column.id));
  }

  removeColumn(index: number): void {
    const columns = this.formGroup.get('formula.columns') as FormArray;
    columns.removeAt(index);
    if (index > 0) {
      const operators = this.formGroup.get('formula.operators') as FormArray;
      operators.removeAt(index);
    }
  }

  submit(): void {
    if (this.formGroup.valid) {
      this.dialogRef.close(this.formGroup.value);
    }
  }
}
