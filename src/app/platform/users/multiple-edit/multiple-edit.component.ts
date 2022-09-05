import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { UserService } from 'src/app/_shared/services/http/user.service';

import { AcdModel } from 'src/app/_shared/models/acd.model';
import { UnitModel } from 'src/app/_shared/models/unit.model';
import { SelectItemModel } from 'src/app/_shared/models/select-item.model';
import { AuthTypes, UserModel } from 'src/app/_shared/models/user.model';
import { ErrorMessages } from 'src/app/_shared/constants/error-messages';
import { Fade } from 'src/app/_shared/constants/animations';

@Component({
  selector: 'app-multiple-edit',
  templateUrl: './multiple-edit.component.html',
  animations: [Fade]
})
export class MultipleEditComponent implements OnInit {

  readonly errorMessages = ErrorMessages;

  readonly authTypes = AuthTypes;

  formGroup: FormGroup;

  checkedItems: AcdModel[];

  loggedUser: UserModel;

  units: UnitModel[] = [];
  permissions: SelectItemModel[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder,
              private dialogRef: MatDialogRef<MultipleEditComponent>,
              private userService: UserService) {}

  ngOnInit(): void {
    this.checkedItems = this.data.checkedItems;

    this.loggedUser = this.data.loggedUser;
    this.units = this.data.units;
    this.permissions = this.data.permissions;

    this.formGroup = this.fb.group({
      authType: this.fb.control(null),
      permission: this.fb.control(null, Validators.required),
      units: this.fb.control([], null),
      overrideWithNull: this.fb.control(null)
    });
  }

  submit(): void {
    if (this.formGroup.valid) {
      this.userService.multipleUpdate(this.checkedItems, this.formGroup.value).then(response => this.dialogRef.close(response));
    }
  }
}
