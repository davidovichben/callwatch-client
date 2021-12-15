import { Component, HostListener, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { TagService } from 'src/app/_shared/services/http/tag.service';
import { SelectItemModel } from 'src/app/_shared/models/select-item.model';

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

  isListToggled = false;
  isLoading = false;

  selectedTags = [];
  suggestedTags = [];

  unmatchedKeyword: string;

  constructor(private tagService: TagService) {}

  addTag(tag: SelectItemModel, index?: number): void {
    if (index) {
      this.suggestedTags.splice(index, 1);
    }

    this.selectedTags.push(tag);
    this.isListToggled = false;

    this.propagateChange(this.selectedTags.map(tag => tag.id));
  }

  removeTag(index: number, event: MouseEvent): void {
    event.stopPropagation();

    this.selectedTags.splice(index, 1);
    this.propagateChange(this.selectedTags.map(tag => tag.id));
  }

  createTag(): void {
    if (!this.isLoading && this.unmatchedKeyword) {
      this.isLoading = true;

      this.tagService.newTag(this.type, this.unmatchedKeyword).then(tag => {
        if (tag) {
          this.addTag(tag);
          this.unmatchedKeyword = null;
        }

        this.isLoading = false;
      })
    }
  }

  openList(event: MouseEvent): void {
    event.stopPropagation();
    this.isListToggled = !this.isListToggled;

    this.loadTags();
  }

  loadTags(keyword?: string): void {
    if (!this.isLoading) {
      this.isLoading = true;

      const existingTagIds = this.selectedTags.map(tag => tag.id);
      this.tagService.getTags(this.type, existingTagIds, keyword).then(tags => {
        this.suggestedTags = tags;

        if (keyword && !tags.find(tag => tag.name === keyword) && !this.selectedTags.find(tag => tag.name === keyword)) {
          this.unmatchedKeyword = keyword;
        } else {
          this.unmatchedKeyword = null;
        }

        this.isLoading = false;
      });
    }
  }

  writeValue(tagIds: number[]): void {
    if (tagIds) {
      this.loadTags();
      this.selectedTags = this.suggestedTags.filter(tag => tagIds.includes(tag.id));
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
    if (!this.isListToggled) {
      return;
    }

    let isOutside = true;
    (event as PointerEvent)['path'].forEach(ele => {
      if (ele.id === 'suggestedTags') {
        isOutside = false;
      }
    })

    this.isListToggled = !isOutside;
  }
}
