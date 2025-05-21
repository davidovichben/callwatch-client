import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { NotificationService } from 'src/app/_shared/services/generic/notification.service';
import { UnitService } from 'src/app/_shared/services/http/unit.service';
import { UnitStateService } from 'src/app/_shared/services/state/unit-state.service';

import { UnitModel } from 'src/app/_shared/models/unit.model';
import { AppConstants } from 'src/app/_shared/constants/app.constants';

import { TranslatePipe } from 'src/app/_shared/pipes/translate/translate.pipe';

// Interface for unit transfer operations
interface TransferredUnit {
  _id: string;
  name: string;
}

@Component({
  selector: 'app-unit-tree',
  templateUrl: './unit-tree.component.html',
  styleUrls: ['./unit-tree.component.sass']
})
export class UnitTreeComponent implements OnInit, OnDestroy {
  @ViewChild('dragPlaceholder') dragPlaceholder: ElementRef;
  
  activeUnit: UnitModel;
  loadingUnits = false;
  rootUnit: UnitModel;
  readonly AppConstants = AppConstants;
  readonly sub = new Subscription();
  
  constructor(
    private router: Router,
    private notifications: NotificationService,
    private unitService: UnitService,
    private unitStateService: UnitStateService,
    private t: TranslatePipe
  ) {}

  ngOnInit(): void {
    this.initializeComponentData();
    this.setupSubscriptions();
    this.setActiveBranch();
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
  
  initializeComponentData(): void {
    this.rootUnit = this.unitStateService.rootUnit;
    this.activeUnit = this.unitStateService.activeUnit;
  }
  
  /**
   * Setup all subscriptions for this component
   */
  private setupSubscriptions(): void {
    // Handle unit loaded events
    this.sub.add(this.unitStateService.activeUnitChanged.subscribe(unit => {
      this.setActiveUnit(unit);
    }));
    
    // Handle unit name change events
    this.sub.add(this.unitStateService.unitNameChanged.subscribe(changedUnit => {
      this.updateUnitNameInTree(changedUnit);
    }));
    
    // Handle unit transfer events
    this.sub.add(this.unitStateService.unitTransferred.subscribe(async () => {
      await this.refreshUnits();
    }));
    
    // Listen to the refreshTree event to update the tree
    this.sub.add(this.unitStateService.refreshTree.subscribe(async () => {
      await this.refreshUnits();
    }));
  }
  
  /**
   * Refresh all units
   */
  async refreshUnits(): Promise<void> {
    try {
      this.loadingUnits = true;
      const units = await this.unitService.getUnits();
      if (units) {
        this.rootUnit.units = units;
        this.ensureActiveUnitExpanded();
      }
    } catch (error) {
      this.notifications.error('Failed to refresh units');
    } finally {
      this.loadingUnits = false;
    }
  }
  
  /**
   * Ensure that after a tree refresh, the active unit's branch remains expanded
   */
  private ensureActiveUnitExpanded(): void {
    if (!this.activeUnit || !this.rootUnit?.units) {
      return;
    }

    if (this.activeUnit._id === AppConstants.ROOT_UNIT_ID) {
      // If root is active, no need to expand anything
      return;
    }

    // Use the ancestors to navigate through the tree
    if (this.activeUnit.ancestors && this.activeUnit.ancestors.length > 0) {
      this.setActiveBranch();
    } else {
      // If no ancestors, try to find the unit directly in the tree
      this.findAndExpandUnitInTree(this.activeUnit._id, this.rootUnit.units);
    }
  }

  /**
   * Recursively find a unit in the tree and expand its path
   * @returns true if the unit was found
   */
  private findAndExpandUnitInTree(unitId: string, unitList: UnitModel[], parentUnit?: UnitModel): boolean {
    if (!unitList) {
      return false;
    }

    // Check if the unit is in this level
    for (const unit of unitList) {
      if (unit._id === unitId) {
        // Unit found, ensure parent is toggled
        if (parentUnit) {
          parentUnit.toggled = true;
        }
        return true;
      }

      // Look in children if any
      if (unit.units && unit.units.length > 0) {
        const found = this.findAndExpandUnitInTree(unitId, unit.units, unit);
        if (found) {
          // If found in children, ensure this level is toggled
          unit.toggled = true;
          if (parentUnit) {
            parentUnit.toggled = true;
          }
          return true;
        }
      }
    }

    return false;
  }

  /**
   * Update the name of a unit in the tree when it changes
   */
  private updateUnitNameInTree(changedUnit: UnitModel): void {
    if (!changedUnit || !this.rootUnit.units) {
      return;
    }

    // If unit has ancestors, use them to locate the unit
    if (changedUnit.ancestors && changedUnit.ancestors.length > 0) {
      let units = this.rootUnit.units;
      
      changedUnit.ancestors.forEach(ancestor => {
        if (!units) {
          return;
        }

        const unit = units.find(unit => unit._id === ancestor._id);
        if (unit) {
          units = unit.units;

          if (unit._id === changedUnit._id) {
            unit.name = changedUnit.name;
          }
        }
      });
    } else {
      // If no ancestors, search the entire tree
      this.updateUnitNameRecursively(changedUnit, this.rootUnit.units);
    }
  }

  /**
   * Recursively search for a unit to update its name
   */
  private updateUnitNameRecursively(changedUnit: UnitModel, unitList: UnitModel[]): boolean {
    if (!unitList) {
      return false;
    }

    for (const unit of unitList) {
      if (unit._id === changedUnit._id) {
        unit.name = changedUnit.name;
        return true;
      }

      if (unit.units && this.updateUnitNameRecursively(changedUnit, unit.units)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Set the active unit and update the UI
   */
  private setActiveUnit(unit?: UnitModel): void {
    if (!unit) {
      return;
    }

    this.activeUnit = unit;
    this.setActiveBranch();
  }

  /**
   * Expand the branches that lead to the active unit
   */
  private setActiveBranch(): void {
    if (!this.activeUnit || !this.rootUnit.units) {
      return;
    }

    // Skip for root unit
    if (this.activeUnit._id === AppConstants.ROOT_UNIT_ID) {
      return;
    }

    // Use ancestors if available
    if (this.activeUnit.ancestors && this.activeUnit.ancestors.length > 0) {
      let parentUnit = null;
      this.activeUnit.ancestors.forEach(ancestor => {
        parentUnit = this.expandBranchToUnit(ancestor._id, parentUnit);
      });
    } else {
      // If no ancestors, find the unit in the tree
      this.findAndExpandUnitInTree(this.activeUnit._id, this.rootUnit.units);
    }
  }

  /**
   * Expand a specific branch to show a unit
   */
  private expandBranchToUnit(unitId: string, parentUnit?: UnitModel): UnitModel {
    const units = parentUnit ? parentUnit.units : this.rootUnit.units;
    if (!units) {
      return null;
    }
    
    const unit = units.find(unit => unit._id === unitId);
    if (unit) {
      unit.toggled = true;
      return unit;
    }

    return null;
  }
  
  
  /**
   * Toggle a unit's expanded/collapsed state.
   * Loads child units if they haven't been loaded yet.
   */
  async toggleUnit(unit: UnitModel): Promise<void> {
    // If units are already loaded or it was already toggled once, just toggle visibility
    if (unit.units || unit.toggled) {
      unit.toggled = !unit.toggled;
      return;
    }
    
    try {
      // Otherwise, load the child units
      unit.units = await this.unitService.getUnits(unit._id);
      unit.toggled = true;
    } catch (error) {
      this.notifications.error('Failed to load unit children');
    }
  }
  
  /**
   * Navigate to a unit when clicked
   */
  unitClicked(unit: UnitModel): void {
    if (unit.disabled) {
      return;
    }
    
    this.router.navigate(['/platform', 'units', unit._id]);
  }
  
  /**
   * Initialize drag operation for a unit
   */
  dragStart(event: DragEvent, unit: UnitModel): void {
    // Create and style drag indicator element
    const dragElement = this.createDragElement(unit.name);
    document.body.appendChild(dragElement);
    
    // Set drag data
    event.dataTransfer.setDragImage(dragElement, 100, 25);
    event.dataTransfer.setData('transferredUnit', JSON.stringify({
      _id: unit._id,
      name: unit.name
    } as TransferredUnit));
  }
  
  /**
   * Handle drop event when a unit is dragged onto another unit
   */
  async drop(event: DragEvent, destinationUnit: UnitModel): Promise<void> {
    event.stopPropagation();
    event.preventDefault();
    
    // Get the transferred unit data
    const transferData = event.dataTransfer.getData('transferredUnit');
    if (!transferData) {
      return;
    }
    
    const transferredUnit = JSON.parse(transferData) as TransferredUnit;
    
    // Validate the operation
    if (!this.isValidTransfer(transferredUnit, destinationUnit)) {
      return;
    }
    
    // Ask for confirmation before transferring
    await this.confirmAndTransferUnit(transferredUnit, destinationUnit);
  }
  
  /**
   * Allow dropping elements
   */
  allowDrop(event: DragEvent): void {
    event.preventDefault();
  }
  
  /**
   * Create an element for the drag operation
   */
  private createDragElement(unitName: string): HTMLElement {
    const ele = this.dragPlaceholder.nativeElement.cloneNode() as HTMLElement;
    ele.style.backgroundColor = '#fff';
    ele.style.width = '200px';
    ele.style.padding = '8px';
    ele.style.position = 'absolute';
    ele.style.top = '0';
    ele.style.right = '50px';
    ele.style.zIndex = '99999';
    ele.textContent = unitName;
    
    return ele;
  }

  /**
   * Check if a transfer operation is valid
   */
  private isValidTransfer(transferredUnit: TransferredUnit, destinationUnit: UnitModel): boolean {
    // Can't transfer to itself
    if (transferredUnit._id === destinationUnit._id) {
      return false;
    }

    // Check if unit is already in destination (should return false if it is)
    const existingUnit = destinationUnit.units?.find(unit => unit._id === transferredUnit._id);
    return !existingUnit;
  }

  /**
   * Ask for confirmation and perform the transfer operation
   */
  private async confirmAndTransferUnit(transferredUnit: TransferredUnit, destinationUnit: UnitModel): Promise<void> {
    const msg = `${this.t.transform('transfer_v')} ${transferredUnit.name} ${this.t.transform('to')} ${destinationUnit.name}?`;

    const confirmation = await this.notifications.warning(msg);
    if (!confirmation.value) {
      return;
    }

    try {
      const response = await this.unitService.transferUnit(transferredUnit._id, destinationUnit._id);
      if (!response) {
        return;
      }

      if (response.error?.errorCode === 1) {
        const errorMsg = this.t.transform('unit_transfer_child_error');
        this.notifications.error(errorMsg);
        return;
      }
      
      this.unitStateService.notifyUnitTransferred(response);
    } catch (error) {
      this.notifications.error('Failed to transfer unit');
    }
  }
}
