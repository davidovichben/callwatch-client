import { Injectable } from '@angular/core';
import { UnitModel } from '../../models/unit.model';
import { UnitTreeService } from './unit-tree.service';

@Injectable({
  providedIn: 'root'
})
export class UnitFilterService {
  
  constructor(private unitTreeService: UnitTreeService) {}
  
  /**
   * Filter units by name
   * @param units All units to filter
   * @param filterValue The filter text to search for
   * @returns Filtered list of units
   */
  filterByName(units: UnitModel[], filterValue: string): UnitModel[] {
    if (!filterValue) {
      return [...units];
    }
    
    const normalizedFilter = filterValue.toLowerCase();
    const result: UnitModel[] = [];
    
    // Find all units matching the filter
    this.unitTreeService.traverseUnitTree(units, (unit) => {
      if (!unit.ignore && unit.name.toLowerCase().includes(normalizedFilter)) {
        result.push(unit);
      }
      return null;
    });
    
    return result;
  }
  
  /**
   * Reset filter and return all units
   * @param units The units array to return
   * @returns The original units array
   */
  resetFilter(units: UnitModel[]): UnitModel[] {
    return [...units];
  }
  
  /**
   * Apply filter to units
   * @param units The units to filter
   * @param filterValue Filter text
   * @returns Filtered units
   */
  applyFilter(units: UnitModel[], filterValue: string): UnitModel[] {
    if (!filterValue) {
      return this.resetFilter(units);
    }
    
    return this.filterByName(units, filterValue);
  }
  
  /**
   * Load and process units
   * @param units Original units array
   * @param ignoredUnit Optional unit to ignore
   */
  loadUnits(units: UnitModel[], ignoredUnit?: UnitModel): UnitModel[] {
    // Create a copy to avoid mutating the original array
    const processedUnits = [...units];
    
    // Apply ignore rules if needed
    if (ignoredUnit) {
      this.applyIgnoreRules(processedUnits, ignoredUnit);
    }
    
    return processedUnits;
  }
  
  /**
   * Refresh the ignore rules when ignoredUnit changes
   */
  refreshIgnoreRules(units: UnitModel[], filteredUnits: UnitModel[], ignoredUnit: UnitModel): void {
    // Reset all ignore flags
    this.unitTreeService.resetProperty(units, 'ignore');
    
    // Apply ignore rules to filtered units
    this.applyIgnoreRules(filteredUnits, ignoredUnit);
  }
  
  /**
   * Apply ignore rules to units
   * @param units The units to process
   * @param ignoredUnit The unit to ignore
   */
  applyIgnoreRules(units: UnitModel[], ignoredUnit: UnitModel): void {
    if (!ignoredUnit || !units) {
      return;
    }
    
    this.unitTreeService.traverseUnitTree(units, (unit) => {
      // Rule 1: Ignore the unit itself
      if (unit._id === ignoredUnit._id) {
        (unit as any).ignore = true;
      }
      
      // Rule 2: Ignore the unit's parent
      if (ignoredUnit.parent && unit._id === UnitModel.getParentId(ignoredUnit.parent)) {
        (unit as any).ignore = true;
      }
      
      // Rule 3: Ignore all descendants of the ignored unit
      if (this.unitTreeService.isDescendantOf(ignoredUnit, unit)) {
        (unit as any).ignore = true;
      }
      
      return null;
    });
  }
  
  /**
   * Check if a unit has any non-ignored children
   */
  hasVisibleChildren(unit: UnitModel): boolean {
    if (!unit.units || unit.units.length === 0) {
      return false;
    }
    
    // Check if all children are ignored
    const allChildrenIgnored = unit.units.every(child => child.ignore);
    return !allChildrenIgnored;
  }
  
  /**
   * Check if there are any non-ignored units available
   */
  hasVisibleUnits(units: UnitModel[]): boolean {
    return units.some(unit => !unit.ignore);
  }
}
