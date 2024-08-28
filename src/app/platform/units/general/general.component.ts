import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
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

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.sass']
})
export class GeneralComponent implements AfterViewInit, OnDestroy {

  @ViewChild('form') form: NgForm;

  readonly sub = new Subscription();

  unit = new UnitModel();
  units: UnitModel[] = [];

  organizationName: string;
  permissions = [];

  isRootUnit = false;

  isSubmitting = false;

  constructor(private route: ActivatedRoute, private router: Router, private userSession: UserSessionService,
              private notifications: NotificationService, private unitService: UnitService,
              private unitStateService: UnitStateService, private dialog: MatDialog) {}

  ngAfterViewInit(): void {
    const route = this.route.parent.parent;

    this.sub.add(route.data.subscribe(() => {
      this.form.reset();

      this.unit = route.snapshot.data.unit;
      this.units = route.snapshot.data.units;
      this.isRootUnit = this.unit._id === 'root';
    }));

    this.organizationName = this.userSession.getUser().organization;
  }

  hasPermission(module: string, action: string): boolean {
    return this.userSession.hasPermission(module, action);
  }

  async reassignUnit(): Promise<void> {
    if (this.unit.hasUnits) {
      const units = await this.unitService.getUnits();
      if (units) {
        const dialog = this.dialog.open(ReassignDialogComponent, {
          data: { replacedUnit: this.unit, units },
          width: '500px'
        })

        this.sub.add(dialog.afterClosed().subscribe(assignedUnitId => {
          if (assignedUnitId) {
            this.deleteUnit(assignedUnitId);
          }
        }));
      }
    } else {
      const confirmation = await this.notifications.warning();
      if (confirmation.value) {
        await this.deleteUnit();
      }
    }
  }

  async deleteUnit(assignedUnitId?: string): Promise<void> {
    const response = await this.unitService.deleteUnit(this.unit._id, assignedUnitId);
    if (response) {
      this.notifications.success();
      await this.router.navigate(['/platform', 'units', 'root']);
      this.unitStateService.refreshTree.next(true);
    }
  }

  async submit(): Promise<void> {
    if (this.isSubmitting) {
      return;
    }
    
    this.isSubmitting = true;
    
    const response = await this.unitService.updateUnit(this.unit._id, this.form.value);
    if (response) {
      this.notifications.success();

      if (this.unit.name !== this.form.value.name) {
        this.unit.name = this.form.value.name;
        this.unitStateService.unitNameChanged.next(this.unit);
      }

      if (this.unit.parent !== this.form.value.parent) {
        this.unit = response.resource;
        this.unitStateService.unitTransferred.next(this.unit);
        this.unitStateService.refreshTree.next(true);
      }

      this.form.form.markAsPristine();
    }
    
    this.isSubmitting = false;
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();

    this.form.reset();
  }
}
