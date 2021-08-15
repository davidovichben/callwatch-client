import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { UserSessionService } from 'src/app/_shared/services/state/user-session.service';

import { UnitModules } from 'src/app/_shared/constants/general';
import { UnitModel } from 'src/app/_shared/models/unit.model';

@Component({
  selector: 'app-units',
  templateUrl: './units.component.html',
  styleUrls: ['./units.component.styl']
})
export class UnitsComponent implements OnInit {

  readonly rootUnit = {
    id: 'root',
    name: 'ROOT',
    units: []
  }

  modules = UnitModules;

  activeUnitId: number;

  constructor(private route: ActivatedRoute,
              public userSession: UserSessionService) {}

  ngOnInit(): void {
    this.activeUnitId = +this.route.snapshot.params.id;
    this.rootUnit.units = this.route.snapshot.data.units;

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
}
