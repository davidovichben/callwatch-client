import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { UnitModel } from '../../models/unit.model';
import { AppConstants } from '../../constants/app.constants';

@Injectable({ providedIn: 'root' })
export class UnitStateService {
  // Observable sources
  refreshTree = new Subject<boolean>();
  unitNameChanged = new Subject<UnitModel>();
  activeUnitChanged = new Subject<UnitModel>();

  // Root unit data for the entire application
  rootUnit: UnitModel;
  
  // Current active unit
  activeUnit: UnitModel = null;

  initializeRootUnit(rootUnit: UnitModel, activeUnit: UnitModel): void {
    this.rootUnit = rootUnit;
    this.activeUnit = activeUnit;
  }
  
  /**
   * Set the active unit and notify subscribers
   */
  setActiveUnit(unit: UnitModel): void {
    if (unit._id === this.activeUnit._id) {
      return; // No change in active unit
    }
    
    this.activeUnit = unit;
    this.activeUnitChanged.next(unit);
  }

  /**
   * Trigger a refresh of the unit tree
   */
  triggerTreeRefresh(): void {
    this.refreshTree.next(true);
  }
  
  /**
   * Notify when a unit name has changed
   */
  notifyUnitNameChanged(unit: UnitModel): void {
    this.unitNameChanged.next(unit);
  }
}
