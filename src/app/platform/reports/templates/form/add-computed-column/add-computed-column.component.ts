import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { LocaleService } from 'src/app/_shared/services/state/locale.service';

import { SelectItemModel } from 'src/app/_shared/models/select-item.model';
import { ErrorMessages } from 'src/app/_shared/constants/error-messages';
import { Operations } from 'src/app/_shared/constants/general';
import { ReportColumnModel } from 'src/app/_shared/models/report-column.model';

@Component({
  selector: 'app-add-computed-column',
  templateUrl: './add-computed-column.component.html',
  styleUrls: ['./add-computed-column.component.styl']
})
export class AddComputedColumnComponent implements OnInit {

  readonly errorMessages = ErrorMessages;
  readonly operations = Operations;

  columnsById = {};

  formGroup: FormGroup;

  constructor(private fb: FormBuilder, private dialogRef: MatDialogRef<AddComputedColumnComponent>,
              @Inject(MAT_DIALOG_DATA) public data: { computedColumn?: ReportColumnModel, columns: SelectItemModel[] },
              public localeService: LocaleService) {}

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      name: this.fb.control(null, Validators.required),
      description: this.fb.control(null),
      formula: this.fb.group({
        columns: this.fb.array([], Validators.required),
        operators: this.fb.array([])
      })
    });

    this.data.columns.forEach(column => this.columnsById[column.id] = column.name);

    if (this.data.computedColumn) {
      this.patchForm();
    }
  }

  private patchForm(): void {
    const formula = this.data.computedColumn.formula;

    formula.columns.forEach((column, index) => {
      (this.formGroup.get('formula.columns') as FormArray).push(this.fb.control(column));
      if (index > 0) {
        const operator = formula.operators[index - 1];
        (this.formGroup.get('formula.operators') as FormArray).push(this.fb.control(operator));
      }
    });

    this.formGroup.patchValue(this.data.computedColumn);
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
