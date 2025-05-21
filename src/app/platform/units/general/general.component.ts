import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

import { ReassignDialogComponent } from './reassign-dialog/reassign-dialog.component';

import { UserSessionService } from 'src/app/_shared/services/state/user-session.service';
import { NotificationService } from 'src/app/_shared/services/generic/notification.service';
import { UnitService } from 'src/app/_shared/services/http/unit.service';
import { UnitStateService } from 'src/app/_shared/services/state/unit-state.service';

import { UnitModel } from 'src/app/_shared/models/unit.model';
import { AppConstants } from 'src/app/_shared/constants/app.constants';

/**
 * Component for managing unit general details
 */
@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.sass']
})
export class GeneralComponent implements OnInit, OnDestroy {
  @ViewChild('form') form: NgForm;

  // Constants and models
  readonly subscription = new Subscription();
  
  // Data models
  unit = new UnitModel();
  units: UnitModel[] = [];

  // UI state
  isRootUnit = false;
  isSubmitting = false;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly userSession: UserSessionService,
    private readonly notifications: NotificationService,
    private readonly unitService: UnitService,
    private readonly unitStateService: UnitStateService,
    private readonly dialog: MatDialog
  ) {}

  /**
   * Initialize component
   */
  ngOnInit(): void {
    this.initializeComponentData();
    this.setupSubscriptions();
  }
  
  /**
   * Clean up resources when component is destroyed
   */
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    
    if (this.form) {
      this.form.reset();
    }
  }
  
  /**
   * Initialize component data from route and user session
   */
  private initializeComponentData(): void {
    this.units = this.route.parent.parent.snapshot.data.units;
    this.initializeActiveUnit(this.unitStateService.activeUnit);
  }
  
  /**
   * Setup all subscriptions for this component
   */
  setupSubscriptions(): void {
    this.subscription.add(this.unitStateService.activeUnitChanged.subscribe(unit => {
      this.form.reset();
      
      this.initializeActiveUnit(unit);
    }));
  }
  
  /**
   * Initialize active unit specific data
   */
  
  private initializeActiveUnit(unit: UnitModel): void {
    this.unit = unit;
    this.isRootUnit = this.unit._id === AppConstants.ROOT_UNIT_ID;
  }
  
  /**
   * Check if user has specific permission
   */
  hasPermission(module: string, action: string): boolean {
    return this.userSession.hasPermission(module, action);
  }

  /**
   * Handle unit reassignment or deletion
   */
  async reassignUnit(): Promise<void> {
    if (this.unit.hasUnits) {
      await this.handleUnitWithChildren();
    } else {
      await this.promptSimpleUnitDeletion();
    }
  }

  /**
   * Delete a unit and optionally reassign its children
   */
  async deleteUnit(assignedUnitId?: string): Promise<void> {
    try {
      const response = await this.unitService.deleteUnit(this.unit._id, assignedUnitId);
      
      if (response) {
        this.notifications.success();
        await this.navigateToRoot();
        this.unitStateService.refreshTree.next(true);
      }
    } catch (error) {
      this.notifications.error('Failed to delete unit');
    }
  }

  /**
   * Submit form to update unit information
   */
  async submit(): Promise<void> {
    if (this.isSubmitting) {
      return;
    }
    
    this.isSubmitting = true;
    
    try {
      const response = await this.unitService.updateUnit(this.unit._id, this.form.value);
      
      if (response) {
        this.notifications.success();
        this.handleSuccessfulUpdate(response);
      }
    } catch (error) {
      this.notifications.error('Failed to update unit');
    } finally {
      this.isSubmitting = false;
    }
  }
  
  /**
   * Handle reassignment for a unit that has children
   */
  private async handleUnitWithChildren(): Promise<void> {
    try {
      const units = await this.unitService.getUnits();
      
      if (units) {
        this.openReassignDialog(units);
      }
    } catch (error) {
      this.notifications.error('Failed to load units');
    }
  }

  /**
   * Open dialog for reassigning children before deletion
   */
  private openReassignDialog(units: UnitModel[]): void {
    const dialogRef = this.dialog.open(ReassignDialogComponent, {
      data: { replacedUnit: this.unit, units },
      width: '500px'
    });

    this.subscription.add(dialogRef.afterClosed().subscribe(assignedUnitId => {
      if (assignedUnitId) {
        this.deleteUnit(assignedUnitId);
      }
    }));
  }

  /**
   * Handle simple unit deletion (unit without children)
   */
  private async promptSimpleUnitDeletion(): Promise<void> {
    const confirmation = await this.notifications.warning();
    
    if (confirmation.value) {
      await this.deleteUnit();
    }
  }

  /**
   * Navigate to the root unit page
   */
  private navigateToRoot(): Promise<boolean> {
    return this.router.navigate(['/platform', 'units']);
  }

  /**
   * Handle successful unit update
   */
  private handleSuccessfulUpdate(response: UnitModel): void {
    // Check if name was changed and emit event
    if (this.unit.name !== this.form.value.name) {
      this.unit.name = this.form.value.name;
      this.unitStateService.notifyUnitNameChanged(this.unit);
    }
  
    // Check if parent was changed and handle transfer
    if (this.unit.parent !== this.form.value.parent) {
      this.unit = response;
      // Emit unit transferred event - the units component will handle refreshing
      this.unitStateService.notifyUnitTransferred(this.unit);
    }

    this.form.form.markAsPristine();
  }
}
