import { Component, ElementRef, HostListener, Input, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { TagService } from 'src/app/_shared/services/http/tag.service';
import { SelectItemModel } from 'src/app/_shared/models/select-item.model';

@Component({
  selector: 'app-tags-input',
  templateUrl: './tags-input.component.html',
  styleUrls: ['../_shared/form-field.styl', './tags-input.component.styl'],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: TagsInputComponent, multi: true }
  ]
})
export class TagsInputComponent implements ControlValueAccessor {

  @Input() placeholder: string;
  @Input() type: string;
  @Input() limit: number;

  @ViewChild('searchInput') searchInput: ElementRef;

  isListToggled = false;
  isLoading = false;

  selectedTags = [];
  suggestedTags = [];

  unmatchedKeyword: string;

  constructor(private tagService: TagService) {}

  addTag(tag: SelectItemModel, index?: number): void {
    if (this.limit && this.selectedTags.length === this.limit) {
      return;
    }

    if (index) {
      this.suggestedTags.splice(index, 1);
    }

    this.selectedTags.push(tag);
    this.isListToggled = false;

    this.emitChange();
  }

  removeTag(index: number, event: MouseEvent): void {
    event.stopPropagation();

    this.selectedTags.splice(index, 1);
    this.emitChange();
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
    if (this.limit && this.selectedTags.length === this.limit) {
      return;
    }

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
          setTimeout(() => this.unmatchedKeyword = this.searchInput.nativeElement.value, 0)
        } else {
          this.unmatchedKeyword = null;
        }

        this.isLoading = false;
      });
    }
  }

  emitChange(): void {
    if (this.limit === 1) {
      this.propagateChange(this.selectedTags[0]?.id);
    } else {
      this.propagateChange(this.selectedTags.map(tag => tag.id));
    }
  }

  writeValue(value?: number | number[]): void {
    if (value) {
      this.tagService.getTags(this.type, []).then(tags => {
        if (Array.isArray(value)) {
          this.selectedTags = tags.filter(tag => value.includes(tag.id));
        } else {
          this.selectedTags = tags.filter(tag => tag.id === value);
        }
      });
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
