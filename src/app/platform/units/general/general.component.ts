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
      this.isRootUnit = this.unit.id === 'root';
    }));

    this.organizationName = this.userSession.getUser().organization;
  }

  hasPermission(module: string, action: string): boolean {
    return this.userSession.hasPermission(module, action);
  }

  reassignUnit(): void {
    if (this.unit.hasUnits) {
      this.unitService.getUnits().then(units => {
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
      });
    } else {
      this.notifications.warning().then(confirmation => {
        if (confirmation.value) {
          this.deleteUnit();
        }
      })
    }
  }

  deleteUnit(assignedUnitId?: number): void {
    this.unitService.deleteUnit(this.unit.id, assignedUnitId).then((response) => {
      if (response) {
        this.notifications.success();
        this.router.navigate(['/platform', 'units', 'root']);
        this.unitStateService.refreshTree.next();
      }
    })
  }

  submit(): void {
    if (!this.isSubmitting) {
      this.isSubmitting = true;
      this.unitService.updateUnit(this.unit.id, this.form.value).then(response => {
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

          this.isSubmitting = false;
        }
      })
    }
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();

    this.form.reset();
  }
}
