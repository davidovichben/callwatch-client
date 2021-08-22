import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { UserSessionService } from 'src/app/_shared/services/state/user-session.service';

import { UnitModules } from 'src/app/_shared/constants/general';

@Component({
  selector: 'app-units',
  templateUrl: './units.component.html',
  styleUrls: ['./units.component.styl']
})
export class UnitsComponent implements OnInit, OnDestroy {

  readonly rootUnit = {
    id: 'root',
    name: 'ROOT',
    units: []
  }

  readonly sub = new Subscription();

  modules = UnitModules;

  activeUnitId: any;

  constructor(private route: ActivatedRoute,
              public userSession: UserSessionService) {}

  ngOnInit(): void {
    this.rootUnit.units = this.route.snapshot.data.units;

    this.sub.add(this.route.params.subscribe(params => {
      this.activeUnitId = params.id;
    }));

    this.setModules();
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

    const unitPermissions = permissions[this.activeUnitId];
    this.modules = this.modules.filter(module => {
      return this.checkAllowedModule(unitPermissions, module)
    });
  }

  checkAllowedModule(unitPermissions, module) {
    if (!module.name) {
      return true;
    }

    return unitPermissions && unitPermissions[module.name] && unitPermissions[module.name].read;
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
