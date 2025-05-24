import { ElementRef, Injectable } from '@angular/core';

interface DropdownPosition {
  top: number | null;
  bottom: number | null;
  width: string;
}

@Injectable()
export class UnitSelectUIService {
  
  /**
   * Calculate dropdown position
   */
  calculateDropdownPosition(
    elementRef: ElementRef,
    dropdownEle: ElementRef,
    widthElement: ElementRef,
    toggleUp: boolean
  ): DropdownPosition {
    const parentRect = elementRef.nativeElement.getBoundingClientRect();
    const dropdownHeight = dropdownEle.nativeElement.getBoundingClientRect().height;
    const spaceBelow = window.innerHeight - parentRect.bottom;
    
    // Determine if dropdown should appear above or below
    const shouldShowAbove = toggleUp || spaceBelow < dropdownHeight;
    
    let top: number | null = null;
    let bottom: number | null = null;
    
    if (shouldShowAbove) {
      bottom = window.innerHeight - parentRect.top - 8;
    } else {
      top = parentRect.bottom - 5;
    }
    
    // Set width to match the width element
    const width = parentRect.width + 'px';
    
    return { top, bottom, width };
  }
  
  /**
   * Create a formatted representation of selected items
   */
  formatSelectionTitle(selectedUnits: any[], placeholder: string): string {
    if (!selectedUnits || selectedUnits.length === 0) {
      return placeholder;
    }
    
    if (selectedUnits.length === 1) {
      return selectedUnits[0].name;
    }
    
    // For multiple units, return first one + count
    return `${selectedUnits[0].name} +${selectedUnits.length - 1}`;
  }
}
