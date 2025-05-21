import { Injectable } from '@angular/core';
import { UnitModel } from '../../models/unit.model';
import { UnitSelectionResult } from '../../models/unit-tree.model';
import { UnitTreeService } from './unit-tree.service';

@Injectable({
  providedIn: 'root'
})
export class UnitSelectionService {
  
  constructor(private unitTreeService: UnitTreeService) {}
  
  /**
   * Select or deselect a unit and its descendants
   */
  selectUnit(unit: UnitModel, isChecked: boolean): void {
    unit.checked = isChecked;
    
    // Apply the same selection to all children
    if (unit.units) {
      this.unitTreeService.applyToAll(unit.units, (childUnit) => {
        childUnit.checked = isChecked;
      });
    }
  }
  
  /**
   * Handle unit selection for both single and multiple modes
   * @param unit Unit to be selected
   * @param units All units array for reference
   * @param multiple Whether multiple selection is enabled
   * @param checked Optional explicit checked state
   * @returns Selection result for UI updates
   */
  handleUnitSelection(unit: UnitModel, units: UnitModel[], multiple: boolean, checked?: boolean): any {
    if (unit.ignore) {
      return null;
    }
    
    let result: any = { updateCheckStatus: false };
    
    if (multiple) {
      // For multiple selection
      const isChecked = checked !== undefined ? checked : !unit.checked;
      
      // Apply selection to unit and its children
      this.selectUnit(unit, isChecked);
      
      // If deselected, also deselect ancestors
      if (!isChecked && unit.ancestors) {
        this.deselectAncestors(unit, units);
      }
      
      // Get selected units
      const selectionResult = this.getSelectedUnits(units);
      result.selected = selectionResult.selectedUnits;
      result.selectedIds = selectionResult.selectedIds;
      
      // Update check status for "Select All" feature
      if (!checked && result.currentCheckStatus) {
        result.updateCheckStatus = true;
      }
    } else {
      // For single selection
      result.selected = unit;
      result.selectedId = unit._id;
      result.closeDropdown = true;
    }
    
    return result;
  }
  
  /**
   * Deselect ancestors of a unit that was unchecked
   */
  deselectAncestors(unit: UnitModel, units: UnitModel[]): void {
    if (!unit.ancestors) {
      return;
    }
    
    // For each ancestor, find and deselect it
    unit.ancestors.forEach(ancestor => {
      const ancestorUnit = this.unitTreeService.findUnitById(
        typeof ancestor === 'string' ? ancestor : ancestor._id,
        units
      );
      
      if (ancestorUnit) {
        ancestorUnit.checked = false;
      }
    });
  }
  
  /**
   * Get the currently selected units and their IDs
   */
  getSelectedUnits(units: UnitModel[]): UnitSelectionResult {
    const selectedUnits: UnitModel[] = [];
    
    // Collect all selected units
    this.unitTreeService.traverseUnitTree(units, (unit) => {
      if (unit.checked) {
        selectedUnits.push(unit);
      }
      return null;
    });
    
    // Extract IDs from the selected units
    const selectedIds = selectedUnits.map(unit => unit._id || unit._id);
    
    return { selectedUnits, selectedIds };
  }
  
  /**
   * Check if units match any of the values in the array and mark them as selected
   */
  selectUnitsByIds(units: UnitModel[], ids: string[]): void {
    if (!ids || ids.length === 0) {
      return;
    }
    
    // Reset all units first
    this.unitTreeService.resetProperty(units, 'checked');
    
    // Check units that match the values
    this.unitTreeService.traverseUnitTree(units, (unit) => {
      if (ids.includes(unit._id)) {
        unit.checked = true;
        
        // Also check children for consistency
        if (unit.units) {
          this.unitTreeService.applyToAll(unit.units, (childUnit) => {
            childUnit.checked = true;
          });
        }
      }
      return null;
    });
  }
  
  /**
   * Select or deselect all units
   */
  selectAll(units: UnitModel[], isChecked: boolean): void {
    // Apply selection to all non-ignored units
    this.unitTreeService.traverseUnitTree(units, (unit) => {
      if (!unit.ignore) {
        unit.checked = isChecked;
      }
      return null;
    });
  }
  
  /**
   * Reset selection
   */
  resetSelection(units: UnitModel[], multiple: boolean): any {
    // Clear selection state
    if (multiple) {
      // Deselect all units
      this.selectAll(units, false);
      return { selected: [], selectedIds: [] };
    } else {
      return { selected: null, selectedId: null };
    }
  }
}
