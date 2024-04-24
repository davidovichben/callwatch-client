import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { SelectService } from 'src/app/_shared/services/http/select.service';
import { ReportWidgetService } from 'src/app/_shared/services/http/report-widget.service';

import { ErrorMessages } from 'src/app/_shared/constants/error-messages';
import { SelectItemModel } from 'src/app/_shared/models/select-item.model';
import { Fade } from 'src/app/_shared/constants/animations';
import {
  CalculationTypes,
  DataTypes,
  TemporaryDesignTypes,
  WidgetTypes
} from 'src/app/_shared/models/report-widget.model';
import { DesignColors } from 'src/app/_shared/models/report-column.model';

@Component({
  selector: 'app-widget-form',
  templateUrl: './widget-form.component.html',
  styleUrls: ['./widget-form.component.sass'],
  animations: [Fade]
})
export class WidgetFormComponent implements OnInit {
  readonly errorMessages = ErrorMessages;
  readonly types = WidgetTypes;
  readonly calculationTypes = CalculationTypes;
  readonly typeIcons = ['donut_small', 'speed', 'table_chart', 'looks_one'];
  readonly dataTypes = DataTypes;

  formGroup: UntypedFormGroup;

  columns: SelectItemModel[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data, private fb: UntypedFormBuilder,
              private dialogRef: MatDialogRef<WidgetFormComponent>,
              private selectService: SelectService, private widgetService: ReportWidgetService) {}

  ngOnInit(): void {
    this.makeForm();
  }

  private makeForm(): void {
    this.formGroup = this.fb.group({
      name: this.fb.control(null, Validators.required),
      description: this.fb.control(null),
      type: this.fb.control('numerical', Validators.required),
      module: this.fb.control(null, Validators.required),
      column: this.fb.control(null, Validators.required),
      calculationType: this.fb.control('sum'),
      dataType: this.fb.control('number'),
      dataSource: this.fb.control(null, Validators.required),
      conditionalDesign: this.fb.group({
        equalTo: this.fb.array([]),
        greaterThan: this.fb.group({
          value: this.fb.control(null),
          duration: this.fb.control(null),
          color: this.fb.control(null)
        }),
        lessThan: this.fb.group({
          value: this.fb.control(null),
          duration: this.fb.control(null),
          color: this.fb.control(null)
        }),
        between: this.fb.group({
          values: this.fb.group({
            from: this.fb.control(null),
            to: this.fb.control(null)
          }),
          duration: this.fb.control(null),
          color: this.fb.control(null),
        }),
        temporary: this.fb.array([]),
        currentReportOnly: this.fb.control(null)
      })
      // meterLimits: this.fb.group({
      //   min: this.fb.control(null),
      //   max: this.fb.control(null)
      // }, Validators.required),
      // color: this.fb.group({
      //   from: this.fb.control(null),
      //   to: this.fb.control(null),
      //   value: this.fb.control(null)
      // }, Validators.required),
    });
  }

  setType(type: string): void {
    this.formGroup.get('type').patchValue(type);
  }

  moduleChanged(moduleId: number): void {
    if (this.formGroup.get('column').value) {
      this.formGroup.get('column').reset();
    }

    this.getModuleColumns(moduleId);
  }

  private getModuleColumns(moduleId: number): Promise<any> {
    return this.selectService.select('reportModuleColumn', { moduleId }).then(columns => {
      if (columns) {
        this.columns = columns;
      }
    })
  }

  submit(): void {
    console.log(this.formGroup)
    if (this.formGroup.valid) {
      this.widgetService.newReportWidget(this.formGroup.value).then(response => {
        if (response) {
          this.dialogRef.close(true);
        }
      })
    }
  }
}
