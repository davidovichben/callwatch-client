import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  styleUrls: ['./units.component.styl']
})
export class UnitsComponent implements OnInit, OnDestroy {

  readonly rootUnit = {
    id: 'root',
    name: '',
    units: []
  }

  readonly sub = new Subscription();

  modules = UnitModules;

  activeUnit: UnitModel;

  loadingUnits: boolean;

  constructor(private route: ActivatedRoute,
              private dialog: MatDialog,
              public userSession: UserSessionService,
              private unitService: UnitService,
              private notifications: NotificationService,
              private unitStateService: UnitStateService) {}

  ngOnInit(): void {
    this.rootUnit.name = this.userSession.getUser().organization;
    this.rootUnit.units = this.route.snapshot.data.units;

    this.sub.add(this.route.params.subscribe(() => {
      this.activeUnit = this.route.snapshot.data.unit;
    }));

    this.sub.add(this.unitStateService.unitNameChanged.subscribe(unit =>
    {
      const activeUnit = this.activeUnit.ancestors.find(ancestor => ancestor.id === unit.id);
      if (activeUnit) {
        activeUnit.name = unit.name;
      }
    }));

    this.setModules();
  }

  openFormDialog(): void {
    const dialog = this.dialog.open(UnitFormComponent, {
      width: '600px',
      data: this.rootUnit.units
    });

    this.sub.add(dialog.afterClosed().subscribe(saved => {
      if (saved) {
        this.loadingUnits = true;
        this.unitService.getUnits().then(response => {
          if (response) {
            this.notifications.success();
            this.rootUnit.units = response;
          }

          this.loadingUnits = false;
        })
      }
    }))
  }

  private setModules(): void {
    const user = this.userSession.getUser();
    if (user.admin) {
      return;
    }

    const permissions = user.permissions;
    if (permissions === 'root') {
      return;
    }

    this.modules = this.modules.filter(module => {
      return this.checkAllowedModule(module.name)
    });
  }

  private checkAllowedModule(moduleName: string) {
    if (moduleName === 'general') {
      return true;
    }

    return this.userSession.hasPermission(moduleName, 'read');
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
