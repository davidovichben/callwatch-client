import { Component, HostListener, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-chips-input',
  templateUrl: './chips-input.component.html',
  styleUrls: ['./chips-input.component.styl'],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: ChipsInputComponent, multi: true }
  ]
})
export class ChipsInputComponent implements ControlValueAccessor {

  @Input() placeholder: string = 'תגיות';
  @Input() rules: { pattern?: string; length?: number } = {};

  regex: RegExp;

  listToggled = false;

  selectedTags = [];
  suggestedTags = [];

  ngOnInit(): void {
    if (this.rules.pattern) {
      this.regex = new RegExp(this.rules.pattern);
    }
  }

  addTag(tag: string, index: number): void {
    this.suggestedTags.splice(index, 1);
    this.selectedTags.push(tag);
    this.listToggled = false;
  }

  removeTag(index: number): void {
    this.selectedTags.splice(index, 1);
    this.propagateChange(this.selectedTags);
  }

  // keyPressed(event: KeyboardEvent, input: HTMLInputElement): void {
  //   if (event.key !== 'Enter') {
  //     if (this.regex && !this.regex.test(event.key)) {
  //       event.preventDefault();
  //     }
  //
  //     if (this.rules.length && input.value.length > this.rules.length) {
  //       event.preventDefault();
  //     }
  //   }
  //
  //   if (event.key === 'Enter' && input.value) {
  //     event.preventDefault();
  //
  //     this.values.push(input.value);
  //     this.propagateChange(this.values);
  //
  //     input.value = '';
  //   }
  // }

  writeValue(tags: any[]): void {
    if (tags) {
      this.selectedTags = tags;
    }
  }

  registerOnChange(fn: any) {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {

  }

  setDisabledState(isDisabled: boolean): void {

  }

  private propagateChange = (_: any) => {};

  @HostListener('document:click')
  documentClicked() {
    if (!this.listToggled) {
      return;
    }

    let isOutside = true;
    (event as PointerEvent)['path'].forEach(ele => {
      if (ele.id === 'suggestedTags') {
        isOutside = false;
      }
    })

    this.listToggled = !isOutside;
  }
}
