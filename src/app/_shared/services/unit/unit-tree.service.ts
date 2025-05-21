import { Injectable } from '@angular/core';
import { UnitModel } from '../../models/unit.model';
import { UnitTreeCallback } from '../../models/unit-tree.model';

@Injectable({
  providedIn: 'root'
})
export class UnitTreeService {
  
  /**
   * Traverses the unit tree and performs an operation on each unit
   * @param units The list of units to traverse
   * @param callback The callback function to execute for each unit
   * @param parentUnit Optional parent unit reference
   * @returns Result of the first callback that returns a non-null/undefined value, or null if none do
   */
  traverseUnitTree<T>(
    units: UnitModel[], 
    callback: UnitTreeCallback<T>,
    parentUnit?: UnitModel
  ): T | null {
    if (!units) {
      return null;
    }
    
    for (const unit of units) {
      // Call the callback for this unit
      const result = callback(unit, parentUnit);
      if (result !== null && result !== undefined) {
        return result;
      }
      
      // Recursively process children if any
      if (unit.units && unit.units.length > 0) {
        const childResult = this.traverseUnitTree(unit.units, callback, unit);
        if (childResult !== null && childResult !== undefined) {
          return childResult;
        }
      }
    }
    
    return null;
  }
  
  /**
   * Finds a unit in the tree by its ID
   * @param unitId The ID of the unit to find
   * @param units The unit tree to search in
   * @returns The found unit or null if not found
   */
  findUnitById(unitId: string, units: UnitModel[]): UnitModel | null {
    return this.traverseUnitTree(units, (unit) => {
      if (unit._id === unitId) {
        return unit;
      }
      return null;
    });
  }
  
  /**
   * Check if a unit is a descendant of another unit
   */
  isDescendantOf(potentialParent: UnitModel, unitToCheck: UnitModel): boolean {
    if (!potentialParent || !unitToCheck) {
      return false;
    }
    
    // Use ancestors data if available (more efficient)
    if (unitToCheck.ancestors && unitToCheck.ancestors.length > 0) {
      return unitToCheck.ancestors.some(ancestor => ancestor._id === potentialParent._id);
    }
    
    // Fallback to traversal if no ancestor data
    return !!this.traverseUnitTree(potentialParent.units || [], (unit) => {
      if (unit._id === unitToCheck._id) {
        return true;
      }
      return null;
    });
  }
  
  /**
   * Apply operation to all units in the tree
   */
  applyToAll(units: UnitModel[], callback: (unit: UnitModel) => void): void {
    this.traverseUnitTree(units, (unit) => {
      callback(unit);
      return null;
    });
  }
  
  /**
   * Reset all properties with the given name on all units
   */
  resetProperty(units: UnitModel[], propertyName: string): void {
    this.applyToAll(units, (unit) => {
      (unit as any)[propertyName] = false;
    });
  }
}
