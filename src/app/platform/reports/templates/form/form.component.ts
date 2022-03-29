import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

import { ColumnSettingsComponent } from './column-settings/column-settings.component';
import { DualGroupsSelectComponent } from 'src/app/_shared/components/dual-groups-select/dual-groups-select.component';

import { ReportTemplateService } from 'src/app/_shared/services/http/report-template.service';
import { SelectService } from 'src/app/_shared/services/http/select.service';

import { TranslatePipe } from 'src/app/_shared/pipes/translate/translate.pipe';

import { ErrorMessages } from 'src/app/_shared/constants/error-messages';
import { ReportTemplateModel } from 'src/app/_shared/models/report-template.model';
import { ReportColumnModel } from 'src/app/_shared/models/report-column.model';
import { SelectItemModel } from 'src/app/_shared/models/select-item.model';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styles: [`.form-body { height: 600px }`]
})
export class FormComponent implements OnInit, OnDestroy {

  @ViewChild(DualGroupsSelectComponent) dualGroupsComponent: DualGroupsSelectComponent;

  readonly sub = new Subscription();

  readonly errorMessages = ErrorMessages;

  currentStep = 1;

  modules: SelectItemModel[] = [];
  columns = [];

  formGroup: FormGroup;

  reportTemplate: ReportTemplateModel;

  isSubmitting = false;

  constructor(private router: Router, private route: ActivatedRoute,
              private fb: FormBuilder, private dialog: MatDialog,
              private reportService: ReportTemplateService,
              private selectService: SelectService, private t: TranslatePipe) {}

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      name: this.fb.control(null, Validators.required),
      module: this.fb.control(null, Validators.required),
      description: this.fb.control(null),
      columns: this.fb.control(null, Validators.required)
    });

    const routeData = this.route.snapshot.data;
    this.modules = routeData.modules;
    this.reportTemplate = routeData.reportTemplate;
    if (this.reportTemplate) {
      this.getModuleColumns(this.reportTemplate.module).then(() => {
        const computedColumns = this.reportTemplate.columns.filter(column => column.type === 'computed');
        this.dualGroupsComponent.availableItems.push(...computedColumns);
        this.formGroup.get('columns').patchValue(this.reportTemplate.columns);
      });
    }

    this.formGroup.patchValue(this.reportTemplate);
  }

  moduleChanged(moduleId: number): void {
    if (this.formGroup.get('columns').value) {
      this.formGroup.get('columns').reset();
      this.dualGroupsComponent.reset();
    }

    this.getModuleColumns(moduleId);
  }

  private getModuleColumns(moduleId: number): Promise<any> {
    return this.selectService.select('reportModuleColumn', { moduleId }).then(columns => {
      if (columns) {
        columns = columns.map(column => {
          return { id: column.id, name: this.t.transform('col_' + column.name.toLowerCase()) }
        })

        this.columns = columns;
        this.dualGroupsComponent.availableItems = columns;
      }
    })
  }

  nextStep(): void {
    const name = this.formGroup.get('name');
    const module = this.formGroup.get('module');
    if (name.valid && module.valid) {
      this.currentStep = 2;
    } else {
      name.markAsTouched();
      module.markAsTouched();
    }
  }

  openColumnSettingsDialog(columnType: string, column?: ReportColumnModel, event?: MouseEvent): void {
    if (event) {
      event.stopPropagation();
    }

    const data = { columnType, column };
    if (columnType === 'computed') {
      const standardColumns = this.columns.filter(column => !column.formula);
      Object.assign(data, { columns: standardColumns });
    }

    const dialog = this.dialog.open(ColumnSettingsComponent, {
      data: data,
      width: '800px',
      height: '800px'
    })

    const sub = dialog.afterClosed().subscribe(savedColumn => {
      if (savedColumn) {
        if (column) {
          Object.assign(column, { ...savedColumn });
        } else if (columnType === 'computed') {
          this.dualGroupsComponent.newItem(savedColumn, true);
        }
      }
    });

    this.sub.add(sub);
  }

  submit(): void {
    if (this.formGroup.valid && !this.isSubmitting) {
      this.isSubmitting = true;

      const values = this.formGroup.value;
      this.sanitizeColumns(values.columns);

      if (this.reportTemplate) {
        this.reportService.updateReport(this.reportTemplate.id, values).then(response => {
          this.handleServerResponse(response);
        });
      } else {
        this.reportService.newReport(values).then(response => {
          this.handleServerResponse(response);
        });
      }
    }
  }

  private handleServerResponse(response: boolean): void {
    if (response) {
      this.router.navigate(['/platform', 'reports', 'templates']);
    } else {
      this.isSubmitting = false;
    }
  }

  private sanitizeColumns(columns: ReportColumnModel[]): void {
    columns.forEach(column => {
      if (!column.dataType) {
        column.dataType = 'number';
      }

      if (!column.totalType) {
        column.totalType = 'sum';
      }

      const filteredDesign = {};

      Object.keys(column.conditionalDesign).forEach(conditionName => {
        const condition = column.conditionalDesign[conditionName];
        if ((condition.value || (condition.values && condition.values.from && condition.values.to)) && condition.color) {
          filteredDesign[conditionName] = condition;
        }
      });

      column.conditionalDesign = filteredDesign;
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}

