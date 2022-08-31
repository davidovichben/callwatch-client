import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-multiple-edit',
  templateUrl: './multiple-edit.component.html',
  styleUrls: ['./multiple-edit.component.styl']
})
export class MultipleEditComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public checkedItems: any[]) {}

  removeItem(index: number): void {
    this.checkedItems.splice(index, 1);
  }

  submit(): void {

  }
}
