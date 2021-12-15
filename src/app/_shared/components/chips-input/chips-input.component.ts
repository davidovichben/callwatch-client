import { Component, HostListener, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { TagService } from 'src/app/_shared/services/http/tag.service';

@Component({
  selector: 'app-chips-input',
  templateUrl: './chips-input.component.html',
  styleUrls: ['./chips-input.component.styl'],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: ChipsInputComponent, multi: true }
  ]
})
export class ChipsInputComponent implements ControlValueAccessor {

  @Input() placeholder: string;
  @Input() rules: { pattern?: string; length?: number } = {};
  @Input() type: string;

  regex: RegExp;

  listToggled = false;

  selectedTags = [];
  suggestedTags = [];

  constructor(private tagService: TagService) {}

  ngOnInit(): void {
    if (this.rules.pattern) {
      this.regex = new RegExp(this.rules.pattern);
    }
  }

  addTag(tag: string, index: number): void {
    this.suggestedTags.splice(index, 1);
    this.selectedTags.push(tag);
    this.listToggled = false;

    this.propagateChange(this.selectedTags);
  }

  removeTag(index: number): void {
    this.selectedTags.splice(index, 1);
    this.propagateChange(this.selectedTags);
  }

  openList(event: MouseEvent): void {
    event.stopPropagation();
    this.listToggled = !this.listToggled;

    if (this.suggestedTags.length === 0) {
      this.tagService.getTags(this.type).then(tags => {
        this.suggestedTags = tags;
      });
    }
  }

  onSearchType(keyword: string): void {
    console.log(keyword)
  }

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
