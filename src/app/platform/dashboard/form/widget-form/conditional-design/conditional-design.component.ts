import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, UntypedFormArray, UntypedFormBuilder, Validators } from '@angular/forms';

import { ErrorMessages } from 'src/app/_shared/constants/error-messages';
import { TemporaryDesignTypes } from 'src/app/_shared/models/report-widget.model';
import { DesignColors } from 'src/app/_shared/models/report-column.model';

@Component({
  selector: 'app-conditional-design',
  templateUrl: './conditional-design.component.html',
})
export class ConditionalDesignComponent implements OnInit {
  readonly errorMessages = ErrorMessages;
  readonly temporaryDesignTypes = TemporaryDesignTypes;
  readonly colors = DesignColors;
  readonly designGroupNames = [
    { name: 'greaterThan', label: 'value_greater_than' },
    { name: 'lessThan', label: 'value_less_than' }
  ];

  @Input() formGroup: AbstractControl;

  constructor(private fb: UntypedFormBuilder) {}

  ngOnInit(): void  {
    this.addEqualToDesignGroup();
    this.addTemporaryDesignGroup();

    this.formGroup.valueChanges.subscribe(values => console.log(values))
  }

  addEqualToDesignGroup(): void {
    (this.formGroup.get('equalTo') as UntypedFormArray).push(this.fb.group({
      value: this.fb.control(null, Validators.required),
      duration: this.fb.control(null),
      color: this.fb.control(null)
    }));
  }

  addTemporaryDesignGroup(): void {
    (this.formGroup.get('temporary') as UntypedFormArray).push(this.fb.group({
      type: this.fb.control(null),
      color: this.fb.control(null),
      duration: this.fb.control(null)
    }));
  }
}
