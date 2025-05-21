import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

import { UnitFormComponent } from 'src/app/platform/units/unit-form/unit-form.component';

import { UserSessionService } from 'src/app/_shared/services/state/user-session.service';
import { UnitStateService } from 'src/app/_shared/services/state/unit-state.service';
import { UnitService } from 'src/app/_shared/services/http/unit.service';
import { NotificationService } from 'src/app/_shared/services/generic/notification.service';

import { UnitModel } from 'src/app/_shared/models/unit.model';

import { UnitModules } from 'src/app/_shared/constants/modules';
import { AppConstants } from 'src/app/_shared/constants/app.constants';

@Component({
  selector: 'app-units',
  templateUrl: './units.component.html',
  styleUrls: ['./units.component.sass']
})
export class UnitsComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  
  modules = UnitModules;
  activeUnit!: UnitModel;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly dialog: MatDialog,
    public readonly userSession: UserSessionService,
    private readonly unitService: UnitService,
    private readonly notifications: NotificationService,
    private readonly unitStateService: UnitStateService
  ) {}

  ngOnInit(): void {
    this.initializeUnitState();
    this.setupSubscriptions();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  initializeUnitState() {
    // Initialize the root unit in the UnitStateService
    const rootUnit = {
      _id: AppConstants.ROOT_UNIT_ID,
      name: this.userSession.getUser().organization,
      units: this.route.snapshot.data.units
    };
    
    this.unitStateService.initializeRootUnit(rootUnit, this.activeUnit);
  }
  
  private setupSubscriptions(): void {
    // Handle route parameter changes
    this.route.params
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.updateActiveUnit();
      });
    
    // Handle unit name change events
    this.unitStateService.unitNameChanged
      .pipe(takeUntil(this.destroy$))
      .subscribe(unit => {
        this.updateUnitName(unit);
      });
  }
  
  breadcrumbClicked(ancestor: UnitModel): void {
    if (ancestor.disabled) {
      return;
    }

    this.navigateToUnit(ancestor._id);
  }

  async openFormDialog(): Promise<void> {
    try {
      const units = await this.unitService.getUnits();
  
      const dialogRef = this.dialog.open(UnitFormComponent, {
        width: '600px',
        data: units
      });
  
      dialogRef.afterClosed()
        .pipe(takeUntil(this.destroy$))
        .subscribe(async (unitId: string) => {
          if (unitId) {
            // Notify tree to refresh
            this.unitStateService.triggerTreeRefresh();
            // Navigate to the new unit
            await this.navigateToUnit(unitId);
            // Show success message
            this.notifications.success();
          }
        });
    } catch (error) {
      this.notifications.error('Failed to load units');
    }
  }
  
  private updateActiveUnit(): void {
    const isRootUnit = !this.route.snapshot.params.id || this.route.snapshot.params.id === AppConstants.ROOT_UNIT_ID;
    
    this.activeUnit = isRootUnit ? this.unitStateService.rootUnit : this.route.snapshot.data.unit;
    this.modules = isRootUnit ? UnitModules.slice(0, 2) : UnitModules;
    
    this.unitStateService.setActiveUnit(this.activeUnit);
  }

  private updateUnitName(unit: UnitModel): void {
    if (!this.activeUnit.ancestors) {
      return;
    }
    
    const activeUnit = this.activeUnit.ancestors.find(ancestor => ancestor._id === unit._id);
    if (activeUnit) {
      activeUnit.name = unit.name;
    }
  }

  private navigateToUnit(unitId: string): Promise<boolean> {
    return this.router.navigate(['/platform', 'units', unitId]);
  }
}
