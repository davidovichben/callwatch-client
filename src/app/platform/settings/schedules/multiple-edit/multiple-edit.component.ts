import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';

import { ScheduleService } from 'src/app/_shared/services/http/schedule.service';

import { SelectItemModel } from 'src/app/_shared/models/select-item.model';

@Component({
  selector: 'app-multiple-edit',
  templateUrl: './multiple-edit.component.html',
  styleUrls: ['../../../../_shared/components/multiple-edit/multiple-edit.component.styl'],
})
export class MultipleEditComponent implements OnInit {

  formGroup: FormGroup;

  checkedItems: any[]

  uniqueSchedules: SelectItemModel[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder,
              private dialogRef: MatDialogRef<MultipleEditComponent>,
              private scheduleService: ScheduleService) {}

  ngOnInit(): void {
    this.checkedItems = this.data.checkedItems;
    this.uniqueSchedules = this.data.uniqueSchedules;

    this.formGroup = this.fb.group({
      tags: this.fb.control(null),
      uniqueSchedule: this.fb.control(null),
      forceEmpty: this.fb.control(null)
    });
  }

  submit(): void {
    if (this.formGroup.valid) {
      this.scheduleService.multipleUpdate(this.checkedItems, this.formGroup.value).then(response => this.dialogRef.close(response));
    }
  }
}
