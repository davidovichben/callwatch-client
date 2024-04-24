import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

import { UnitFormComponent } from 'src/app/platform/units/unit-form/unit-form.component';

import { UserSessionService } from 'src/app/_shared/services/state/user-session.service';
import { UnitStateService } from 'src/app/_shared/services/state/unit-state.service';
import { UnitService } from 'src/app/_shared/services/http/unit.service';
import { NotificationService } from 'src/app/_shared/services/generic/notification.service';

import { UnitModel } from 'src/app/_shared/models/unit.model';

import { UnitModules } from 'src/app/_shared/constants/modules';

@Component({
  selector: 'app-units',
  templateUrl: './units.component.html',
  styleUrls: ['./units.component.sass']
})
export class UnitsComponent implements OnInit, OnDestroy {

  readonly rootUnit = {
    id: 'root',
    name: '',
    units: []
  }

  readonly sub = new Subscription();

  modules;

  activeUnit: UnitModel;

  loadingUnits: boolean;

  constructor(private route: ActivatedRoute, private router: Router,
              private dialog: MatDialog, public userSession: UserSessionService,
              private unitService: UnitService, private notifications: NotificationService,
              private unitStateService: UnitStateService) {}

  ngOnInit(): void {
    this.rootUnit.name = this.userSession.getUser().organization;
    this.rootUnit.units = this.route.snapshot.data.units;

    this.sub.add(this.route.params.subscribe(() => {
      this.activeUnit = this.route.snapshot.data.unit;
      this.modules = this.activeUnit.id === 'root' ? UnitModules.slice(0, 2) : UnitModules;
      this.unitStateService.unitLoaded.next(this.activeUnit);
    }));

    this.sub.add(this.unitStateService.refreshTree.subscribe(() => {
      this.unitService.getUnits().then(units => {
        if (units) {
          this.rootUnit.units = units;
        }
      });
    }));

    this.sub.add(this.unitStateService.unitTransferred.subscribe(unit => {
      this.activeUnit = unit;
    }));

    this.sub.add(this.unitStateService.unitNameChanged.subscribe(unit => {
      const activeUnit = this.activeUnit.ancestors.find(ancestor => ancestor.id === unit.id);
      if (activeUnit) {
        activeUnit.name = unit.name;
      }
    }));
  }

  breadcrumbClicked(ancestor: UnitModel): void {
    if (ancestor.disabled) {
      return;
    }

    this.router.navigate(['/platform', 'units', ancestor.id]);
  }

  openFormDialog(): void {
    this.unitService.getUnits().then(units => {
      const dialog = this.dialog.open(UnitFormComponent, {
        width: '600px',
        data: units
      });

      this.sub.add(dialog.afterClosed().subscribe(unitId => {
        if (unitId) {
          this.unitService.getUnits().then(response => {
            if (response) {
              this.notifications.success();
              this.rootUnit.units = response;
            }
          })

          this.router.navigate(['/platform', 'units', unitId]);
        }
      }))
    })
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
