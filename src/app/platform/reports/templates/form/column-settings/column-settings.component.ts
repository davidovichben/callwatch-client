import { Component, Inject } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validator, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { LocaleService } from 'src/app/_shared/services/state/locale.service';

import { ErrorMessages } from 'src/app/_shared/constants/error-messages';
import { DataTypes, DesignColors, TotalTypes } from 'src/app/_shared/models/report-column.model';
import { Operations } from 'src/app/_shared/constants/general';
import { SelectItemModel } from 'src/app/_shared/models/select-item.model';
import { Fade } from 'src/app/_shared/constants/animations';

@Component({
  selector: 'app-column-settings',
  templateUrl: './column-settings.component.html',
  styleUrls: ['./column.settings.component.sass'],
  animations: [Fade]
})
export class ColumnSettingsComponent {

  readonly errorMessages = ErrorMessages;
  readonly totalTypes = TotalTypes;
  readonly dataTypes = DataTypes;
  readonly operations = Operations;
  readonly designColors = DesignColors;
  readonly designGroupNames = [
    { name: 'equalTo', label: 'value_equal_to' },
    { name: 'greaterThan', label: 'value_greater_than' },
    { name: 'lessThan', label: 'value_less_than' }
  ];

  columnsById = {};

  formGroup: UntypedFormGroup;

  constructor(@Inject(MAT_DIALOG_DATA) public data, private fb: UntypedFormBuilder,
              private dialogRef: MatDialogRef<ColumnSettingsComponent>,
              public localeService: LocaleService) {}

  ngOnInit(): void {
    this.makeForm();
    this.modifyForm();
  }

  private makeForm(): void {
    this.formGroup = this.fb.group({
      name: this.fb.control(null, Validators.required),
      description: this.fb.control(null),
      title: this.fb.control(null),
      subTitle: this.fb.control(null),
      totalType: this.fb.control('sum', Validators.required),
      dataType: this.fb.control('number', Validators.required),
      showExternal: this.fb.control(false),
      showInternal: this.fb.control(false),
      conditionalDesign: this.fb.group({
        equalTo: this.fb.group({
          value: this.fb.control(null),
          color: this.fb.control(null)
        }),
        greaterThan: this.fb.group({
          value: this.fb.control(null),
          color: this.fb.control(null)
        }),
        lessThan: this.fb.group({
          value: this.fb.control(null),
          color: this.fb.control(null)
        }),
        between: this.fb.group({
          values: this.fb.group({
            from: this.fb.control(null),
            to: this.fb.control(null)
          }),
          color: this.fb.control(null),
        })
      })
    });
  }

  private modifyForm(): void {
    if (this.data.columnType === 'computed') {
      this.formGroup.addControl('formula', this.fb.group({
        columns: this.fb.array([], Validators.required),
        operators: this.fb.array([])
      }))

      this.data.columns.forEach(column => this.columnsById[column.id] = column.name);
    } else {

      // Removing percent if not computed

      const index = this.dataTypes.findIndex(type => type.value === 'percent');
      this.dataTypes.splice(index, 1);
    }

    if (this.data.column) {
      if (this.data.columnType === 'computed') {
        this.setFormula();
      }

      this.formGroup.patchValue(this.data.column);
    }
  }

  dataTypeChange(value: string): void {
    const totalType = this.formGroup.get('totalType');
    if (value === 'text') {
      totalType.patchValue('count');
      totalType.disable();
    } else {
      totalType.enable();
    }
  }

  private setFormula(): void {
    const formula = this.data.column.formula;

    formula.columns.forEach((column, index) => {
      (this.formGroup.get('formula.columns') as UntypedFormArray).push(this.fb.control(column));
      if (index > 0) {
        const operator = formula.operators[index - 1];
        (this.formGroup.get('formula.operators') as UntypedFormArray).push(this.fb.control(operator));
      }
    });
  }

  addColumn(column: SelectItemModel): void {
    const columns = this.formGroup.get('formula.columns') as UntypedFormArray;
    if (columns.length > 0) {
      const operators = (this.formGroup.get('formula.operators') as UntypedFormArray);
      operators.push(this.fb.control('+'));
    }

    columns.push(this.fb.control(column._id));
  }

  removeColumn(index: number): void {
    const columns = this.formGroup.get('formula.columns') as UntypedFormArray;
    columns.removeAt(index);
    if (index > 0) {
      const operators = this.formGroup.get('formula.operators') as UntypedFormArray;
      operators.removeAt(index);
    }
  }

  submit(): void {
    if (this.formGroup.valid) {
      this.dialogRef.close(this.formGroup.getRawValue());
    }
  }
}
