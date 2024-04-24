import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';

import { ScheduleService } from 'src/app/_shared/services/http/schedule.service';

import { SelectItemModel } from 'src/app/_shared/models/select-item.model';

@Component({
  selector: 'app-multiple-edit',
  templateUrl: './multiple-edit.component.html',
  styleUrls: ['../../../../_shared/components/multiple-edit/multiple-edit.component.sass'],
})
export class MultipleEditComponent implements OnInit {

  formGroup: UntypedFormGroup;

  checkedItems: any[]

  uniqueSchedules: SelectItemModel[] = [];

  isSubmitting = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private fb: UntypedFormBuilder,
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
    if (this.formGroup.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      this.scheduleService.multipleUpdate(this.checkedItems, this.formGroup.value).then(response => {
        this.isSubmitting = false;

        if (response) {
          this.dialogRef.close(response)
        }
      });
    }
  }
}
