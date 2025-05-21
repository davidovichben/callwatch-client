import { Component, ElementRef, OnDestroy, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { NotificationService } from 'src/app/_shared/services/generic/notification.service';
import { UnitService } from 'src/app/_shared/services/http/unit.service';
import { UnitStateService } from 'src/app/_shared/services/state/unit-state.service';
import { UnitTreeService } from 'src/app/_shared/services/unit/unit-tree.service';
import { UnitFilterService } from 'src/app/_shared/services/unit/unit-filter.service';

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
export class UnitTreeComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('dragPlaceholder') dragPlaceholder: ElementRef;
  
  activeUnit: UnitModel;
  loadingUnits = false;
  rootUnit: UnitModel;
  readonly AppConstants = AppConstants;
  readonly sub = new Subscription();
  
  // Map to store toggle states of units by ID
  private toggleStateMap = new Map<string, boolean>();
  private initialized = false;
  
  /**
   * Export the current toggle states for persistence or sharing
   * @returns Object with unit ID to toggle state mapping
   */
  exportToggleStates(): Record<string, boolean> {
    const exported: Record<string, boolean> = {};
    this.toggleStateMap.forEach((value, key) => {
      exported[key] = value;
    });
    return exported;
  }
  
  /**
   * Import toggle states from a saved state
   * @param states Object with unit ID to toggle state mapping
   * @param apply Whether to immediately apply the imported states
   */
  importToggleStates(states: Record<string, boolean>, apply = true): void {
    this.toggleStateMap.clear();
    
    Object.entries(states).forEach(([id, value]) => {
      this.toggleStateMap.set(id, value);
    });
    
    if (apply && this.rootUnit?.units) {
      this.applyToggleStates(this.rootUnit.units);
    }
  }
  
  constructor(
    private router: Router,
    private notifications: NotificationService,
    private unitService: UnitService,
    private unitStateService: UnitStateService,
    private unitTreeService: UnitTreeService,
    private unitFilterService: UnitFilterService,
    private t: TranslatePipe
  ) {}

  ngOnInit(): void {
    // Initialize component data and subscriptions
    this.initializeComponentData();
    this.setupSubscriptions();
    
    // Initialize toggle states for all units
    this.initializeToggleStates();
    
    // Expand the active unit branch with a more robust approach
    this.expandActiveUnitPath();
  }
  
  /**
   * After view initialization, ensure active unit is expanded
   */
  ngAfterViewInit(): void {
    // Ensure active unit is expanded after view is initialized
    setTimeout(() => {
      if (!this.initialized) {
        // Force re-expansion if needed
        this.expandActiveUnitPath(true);
      }
    }, 100); // Slightly longer timeout to ensure DOM is ready
  }
  
  /**
   * A more robust approach to expand the active unit's path
   * This method will force the expansion of all ancestors of the active unit
   * @param force If true, will expand even if already initialized
   */
  private async expandActiveUnitPath(force: boolean = false): Promise<void> {
    // Skip if already initialized and not forcing
    if (this.initialized && !force) {
      return;
    }
    
    // Skip if no active unit or it's the root unit
    if (!this.activeUnit?._id ||
        this.activeUnit._id === AppConstants.ROOT_UNIT_ID ||
        !this.rootUnit?.units?.length) {
      this.initialized = true;
      return;
    }
    
    try {
      // Mark as initializing to prevent duplicate initialization
      this.initialized = true;
      
      // Set the active unit's ID and its ancestors in the toggle state map
      this.toggleStateMap.set(this.activeUnit._id, true);
      
      if (this.activeUnit.ancestors?.length) {
        // Process ancestors in order (parents first)
        for (const ancestor of this.activeUnit.ancestors) {
          if (ancestor?._id) {
            // Mark this ancestor as expanded in the toggle map
            this.toggleStateMap.set(ancestor._id, true);
            
            // Load and expand this ancestor unit if needed
            await this.ensureUnitExpanded(ancestor._id);
          }
        }
        
        // After expanding all ancestors, force a final check
        this.ensureActiveUnitToggled();
      } else {
        // If no ancestors, try direct approach
        this.findAndExpandUnitInTree(this.activeUnit._id, this.rootUnit.units);
      }
    } catch (error) {
      console.error('Error expanding active unit path:', error);
    }
  }
  
  /**
   * Ensure a specific unit is expanded, loading its children if necessary
   * @param unitId The ID of the unit to expand
   * @returns Promise that resolves when the unit is expanded
   */
  private async ensureUnitExpanded(unitId: string): Promise<boolean> {
    // First look for the unit in the root units
    const unit = this.unitTreeService.findUnitById(unitId, this.rootUnit.units);
    
    if (!unit) {
      // Unit not found at root level, it might be nested deeper
      return false;
    }
    
    // Mark as expanded in the toggle map
    this.toggleStateMap.set(unitId, true);
    
    // If the unit already has its children loaded, just expand it
    if (unit.units) {
      unit.isToggled = true;
      return true;
    }
    
    // Need to load the children
    try {
      unit.loading = true;
      
      // Load children
      unit.units = await this.unitService.getUnits(unitId);
      
      // Mark as expanded
      unit.isToggled = true;
      
      // Apply toggle states to the newly loaded children
      if (unit.units?.length) {
        this.applyToggleStates(unit.units);
      }
      
      return true;
    } catch (error) {
      console.error(`Failed to load children for unit ${unitId}:`, error);
      return false;
    } finally {
      unit.loading = false;
    }
  }
  
  /**
   * Expand the active unit branch and ensure it's visible
   */
  private expandActiveBranch(): void {
    if (this.isTreeDataReady()) {
      // Expand the active unit branch
      this.setActiveBranch();
      
      // Double-check that active unit is properly toggled
      this.ensureActiveUnitToggled();
    }
  }
  
  /**
   * Checks if tree data is ready for expansion
   */
  private isTreeDataReady(): boolean {
    return !!this.activeUnit?._id &&
           !!this.rootUnit?.units?.length &&
           this.activeUnit._id !== AppConstants.ROOT_UNIT_ID;
  }
  
  /**
   * Initialize toggle states for all units
   */
  private initializeToggleStates(): void {
    if (!this.rootUnit?.units?.length) {
      return;
    }
    
    this.unitTreeService.traverseUnitTree(this.rootUnit.units, (unit) => {
      if (unit && unit.isToggled === undefined) {
        unit.isToggled = false;
      }
      return null;
    });
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
    
    // Listen to the refreshTree event to update the tree
    this.sub.add(this.unitStateService.refreshTree.subscribe(async () => {
      await this.refreshUnits();
    }));
    
    this.sub.add(this.unitStateService.unitTransferred.subscribe(async () => {
      await this.refreshUnits();
    }));
  }
  
  /**
   * Refresh all units while preserving toggle states
   */
  async refreshUnits(): Promise<void> {
    try {
      this.loadingUnits = true;
      
      // Save toggle states from current tree before refreshing
      if (this.rootUnit?.units) {
        this.saveToggleStates(this.rootUnit.units);
      }
      
      // Fetch new units from the server
      const units = await this.unitService.getUnits();
      if (units) {
        // Make sure active unit and its ancestors are marked as expanded
        if (this.activeUnit?._id && this.activeUnit._id !== AppConstants.ROOT_UNIT_ID) {
          this.toggleStateMap.set(this.activeUnit._id, true);
          
          if (this.activeUnit.ancestors?.length) {
            this.activeUnit.ancestors.forEach(ancestor => {
              if (ancestor?._id) {
                this.toggleStateMap.set(ancestor._id, true);
              }
            });
          }
        }
        
        // Apply saved toggle states to the new units
        this.applyToggleStates(units);
        
        // Update the tree with new units
        this.rootUnit.units = units;
        
        // Ensure active unit's branch is expanded
        this.ensureActiveUnitToggled();
        
        // Mark as initialized
        this.initialized = true;
      }
    } catch (error) {
      this.notifications.error('Failed to refresh units');
    } finally {
      this.loadingUnits = false;
    }
  }
  
  /**
   * Recursively find a unit in the tree and expand its path
   * This is a more direct and efficient implementation
   * @returns true if the unit was found
   */
  private findAndExpandUnitInTree(unitId: string, unitList: UnitModel[], parentUnit?: UnitModel): boolean {
    if (!unitList?.length || !unitId) {
      return false;
    }
    
    // First, try to find the unit directly at this level
    for (const unit of unitList) {
      // If we found the unit we're looking for
      if (unit._id === unitId) {
        // Ensure this unit is expanded in the toggle map
        this.toggleStateMap.set(unit._id, true);
        
        // If there's a parent unit, expand it too
        if (parentUnit) {
          parentUnit.isToggled = true;
          this.toggleStateMap.set(parentUnit._id, true);
        }
        
        return true;
      }
      
      // Check if the unit we're looking for is in the children
      if (unit.units?.length) {
        const foundInChildren = this.findAndExpandUnitInTree(unitId, unit.units, unit);
        
        // If found in children, mark this unit as expanded
        if (foundInChildren) {
          unit.isToggled = true;
          this.toggleStateMap.set(unit._id, true);
          
          // Also expand parent if it exists
          if (parentUnit) {
            parentUnit.isToggled = true;
            this.toggleStateMap.set(parentUnit._id, true);
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

    // Use the tree service to find and update the unit
    this.unitTreeService.traverseUnitTree(this.rootUnit.units, (unit) => {
      if (unit._id === changedUnit._id) {
        unit.name = changedUnit.name;
        return true;
      }
      return null;
    });
  }

  /**
   * Set the active unit and update the UI
   */
  private setActiveUnit(unit?: UnitModel): void {
    if (!unit) {
      return;
    }

    this.activeUnit = unit;
    
    // Only try to expand if we have the necessary data
    if (this.isTreeDataReady()) {
      // Mark as initialized to prevent duplicate expansion
      this.initialized = true;
      this.setActiveBranch();
    }
  }

  /**
   * Expand the branches that lead to the active unit
   */
  private setActiveBranch(): void {
    if (!this.activeUnit?._id || !this.rootUnit?.units?.length) {
      return;
    }
  
    // Skip for root unit
    if (this.activeUnit._id === AppConstants.ROOT_UNIT_ID) {
      return;
    }
  
    // Mark the active unit as expanded in the toggle state map
    this.toggleStateMap.set(this.activeUnit._id, true);
    
    // Use ancestors if available
    if (this.activeUnit.ancestors?.length) {
      // Create a list of all ancestor IDs for quick lookup
      const ancestorIds = new Set<string>();
      this.activeUnit.ancestors.forEach(ancestor => {
        if (ancestor?._id) {
          ancestorIds.add(ancestor._id);
          // Mark as expanded in toggle state map
          this.toggleStateMap.set(ancestor._id, true);
        }
      });
      
      // Now expand all ancestors by recursively traversing the tree
      this.recursivelyExpandAncestors(this.rootUnit.units, ancestorIds);
      
      // Finally, directly find and expand the active unit itself
      this.findAndExpandUnitInTree(this.activeUnit._id, this.rootUnit.units);
    } else {
      // If no ancestors, find the unit in the tree
      this.findAndExpandUnitInTree(this.activeUnit._id, this.rootUnit.units);
    }
  }
  
  /**
   * Recursively search for and expand all ancestor units
   * @param units The list of units to search in
   * @param ancestorIds The set of ancestor IDs to look for
   */
  private recursivelyExpandAncestors(units: UnitModel[], ancestorIds: Set<string>): void {
    if (!units?.length || !ancestorIds.size) {
      return;
    }
    
    // Iterate through all units at this level
    for (const unit of units) {
      if (!unit?._id) continue;
      
      // If this unit is an ancestor, expand it
      if (ancestorIds.has(unit._id)) {
        // Mark as expanded
        unit.isToggled = true;
        this.toggleStateMap.set(unit._id, true);
        
        // If this unit has children, continue searching there
        if (unit.units?.length) {
          this.recursivelyExpandAncestors(unit.units, ancestorIds);
        }
      }
      
      // Even if not an ancestor, check its children - ancestors might be nested deeper
      if (unit.units?.length) {
        this.recursivelyExpandAncestors(unit.units, ancestorIds);
      }
    }
  }
      
      /**
       * Ensure the active unit is toggled after refreshes or data changes
       * This is a fallback mechanism to guarantee the active unit's branch is expanded
       */
      private ensureActiveUnitToggled(): void {
    if (!this.activeUnit?._id || !this.rootUnit?.units?.length) {
      return;
    }
    
    // Skip for root unit
    if (this.activeUnit._id === AppConstants.ROOT_UNIT_ID) {
      return;
    }
    
    // Get all ancestors of the active unit
    const ancestorIds = new Set<string>();
    
    if (this.activeUnit.ancestors?.length) {
      // Add all ancestor IDs to the set
      this.activeUnit.ancestors.forEach(ancestor => {
        if (ancestor?._id) {
          ancestorIds.add(ancestor._id);
          
          // Ensure ancestor is toggled in the state map
          this.toggleStateMap.set(ancestor._id, true);
        }
      });
    }
    
    // Make sure each ancestor in the tree is actually toggled
    if (ancestorIds.size > 0) {
      this.unitTreeService.traverseUnitTree(this.rootUnit.units, (unit) => {
        if (unit?._id && ancestorIds.has(unit._id)) {
          // This is an ancestor - make sure it's toggled
          unit.isToggled = true;
              
              // If this is the parent of our target unit, check if target is in its children
              if (this.activeUnit.parent === unit._id && unit.units?.length) {
                // Find the active unit in this parent's children
                const activeUnitInParent = unit.units.find(child =>
                  child._id === this.activeUnit._id
                );
                
                // If found, make sure it's visible
                if (activeUnitInParent) {
                  activeUnitInParent.isToggled = true;
                  this.toggleStateMap.set(activeUnitInParent._id, true);
                }
              }
            }
            return null;
          });
        }
        
        // Also try direct path finding as a backup approach
        this.findAndExpandUnitInTree(this.activeUnit._id, this.rootUnit.units);
        
        // As a final measure, force the active unit ID to be expanded in the toggle map
        this.toggleStateMap.set(this.activeUnit._id, true);
      }

  /**
   * Expand a specific branch to show a unit
   */
  private expandBranchToUnit(unitId: string, parentUnit?: UnitModel): UnitModel {
    const units = parentUnit?.units || this.rootUnit?.units;
    if (!units?.length) {
      return null;
    }
    
    // Use UnitTreeService to find the unit
    const unit = this.unitTreeService.findUnitById(unitId, units);
    if (unit?._id) {
      // Mark as expanded in UI and toggle state map
      unit.isToggled = true;
      this.toggleStateMap.set(unit._id, true);
      return unit;
    }

    return null;
  }
  
  
  /**
   * Toggle a unit's expanded/collapsed state.
   * Loads child units if they haven't been loaded yet.
   */
  async toggleUnit(unit: UnitModel): Promise<void> {
    if (!unit || !unit._id) {
      return;
    }
    
    // If units are already loaded or it was already toggled once, just toggle visibility
    if (unit.units || unit.isToggled !== undefined) {
      unit.isToggled = !unit.isToggled;
      
      // Always update the toggle state in the map
      this.toggleStateMap.set(unit._id, unit.isToggled);
      
      // If collapsing, check if we need to remember child states
      if (!unit.isToggled && unit.units?.length) {
        // Save toggle states of children before collapsing
        this.saveToggleStates(unit.units);
      }
      
      // If expanding and this is an ancestor of the active unit, expand the path
      if (unit.isToggled &&
          this.activeUnit?._id &&
          this.activeUnit._id !== AppConstants.ROOT_UNIT_ID &&
          this.activeUnit.ancestors?.some(a => a?._id === unit._id)) {
        
        // This is an ancestor of the active unit, ensure the path is expanded
        setTimeout(() => this.ensureActiveUnitToggled(), 0);
      }
      
      return;
    }
    
    try {
      // Set loading state
      unit.loading = true;
      
      // Load the child units
      unit.units = await this.unitService.getUnits(unit._id);
      
      // Mark as expanded
      unit.isToggled = true;
      this.toggleStateMap.set(unit._id, true);
      
      // Apply saved toggle states to child units if they exist
      if (unit.units?.length) {
        this.applyToggleStates(unit.units);
        
        // If this is an ancestor of the active unit, expand the path
        if (this.activeUnit?._id &&
            this.activeUnit._id !== AppConstants.ROOT_UNIT_ID &&
            this.activeUnit.ancestors?.some(a => a?._id === unit._id)) {
          
          // After applying toggle states, ensure active unit path is expanded
          setTimeout(() => {
            // Try to find the active unit in the children
            this.findAndExpandUnitInTree(this.activeUnit._id, unit.units, unit);
            
            // Also ensure all ancestors are expanded
            this.ensureActiveUnitToggled();
          }, 0);
        }
      }
    } catch (error) {
      this.notifications.error('Failed to load unit children');
    } finally {
      unit.loading = false;
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
       * Manage toggle states for the unit tree
       * @param units The units to process
       * @param operation 'save' to save states, 'apply' to apply saved states
       */
      private manageToggleStates(units: UnitModel[], operation: 'save' | 'apply'): void {
        if (!units?.length) {
          return;
        }
        
        // For saving states, track current unit IDs for cleanup
        const currentUnitIds = operation === 'save' ? new Set<string>() : null;
        
        // For applying states, collect active unit ancestor IDs if needed
        const activeUnitAncestorIds = new Set<string>();
        if (operation === 'apply' && this.activeUnit?._id && this.activeUnit?.ancestors?.length) {
          // Add all ancestors to ensure the path to active unit is expanded
          this.activeUnit.ancestors.forEach(ancestor => {
            if (ancestor?._id) {
              activeUnitAncestorIds.add(ancestor._id);
              this.toggleStateMap.set(ancestor._id, true);
            }
          });
          
          // Add active unit ID
          activeUnitAncestorIds.add(this.activeUnit._id);
          this.toggleStateMap.set(this.activeUnit._id, true);
        }
        
        // Process all units
        this.unitTreeService.traverseUnitTree(units, (unit) => {
          if (!unit?._id) return null;
          
          if (operation === 'save') {
            // Save toggle state
            currentUnitIds.add(unit._id);
            this.toggleStateMap.set(unit._id, !!unit.isToggled);
          } else {
            // Apply toggle state
            if (this.toggleStateMap.has(unit._id)) {
              unit.isToggled = this.toggleStateMap.get(unit._id);
            } else if (activeUnitAncestorIds.has(unit._id)) {
              unit.isToggled = true;
              this.toggleStateMap.set(unit._id, true);
            } else {
              unit.isToggled = false;
            }
          }
          return null;
        });
        
        // Cleanup for save operation
        if (operation === 'save' && currentUnitIds) {
          Array.from(this.toggleStateMap.keys())
            .filter(id => !currentUnitIds.has(id))
            .forEach(id => this.toggleStateMap.delete(id));
        }
      }
      
      /**
       * Save toggle states - alias for manageToggleStates
       */
      private saveToggleStates(units: UnitModel[]): void {
        this.manageToggleStates(units, 'save');
      }
      
      /**
       * Apply toggle states - alias for manageToggleStates
       */
      private applyToggleStates(units: UnitModel[]): void {
        this.manageToggleStates(units, 'apply');
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
    
    // Find the source unit in the tree
    const sourceUnit = this.unitTreeService.findUnitById(transferredUnit._id, this.rootUnit.units);
    
    // Can always transfer to the root unless it's already there
    console.log(destinationUnit._id)
    if (destinationUnit._id === AppConstants.ROOT_UNIT_ID) {
      console.log(sourceUnit.parent)
      return sourceUnit.parent !== null;
    }
    
    // Check if unit is already in destination
    const existingUnit = this.unitTreeService.findUnitById(transferredUnit._id, destinationUnit.units || []);
    if (existingUnit) {
      return false;
    }
    
    // Check if destination is a descendant of the source (would create circular dependency)
    return !(sourceUnit && this.unitTreeService.isDescendantOf(sourceUnit, destinationUnit));
  }

  /**
   * Ask for confirmation and perform the transfer operation
   */
  private async confirmAndTransferUnit(transferredUnit: TransferredUnit, destinationUnit: UnitModel): Promise<void> {
    try {
      // Build confirmation message
      const msg = `${this.t.transform('transfer_v')} ${transferredUnit.name} ${this.t.transform('to')} ${destinationUnit.name}?`;
  
      const confirmation = await this.notifications.warning(msg);
      if (!confirmation.value) {
        return;
      }
  
      const response = await this.unitService.transferUnit(transferredUnit._id, destinationUnit._id);
      if (!response) {
        return;
      }
  
      if (response.error?.errorCode === 1) {
        this.notifications.error(this.t.transform('unit_transfer_child_error'));
        return;
      }
      
      this.unitStateService.notifyUnitTransferred(response);
    } catch (error) {
      this.notifications.error('Failed to transfer unit');
    }
  }
}
