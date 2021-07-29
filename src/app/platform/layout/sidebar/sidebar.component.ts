import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { UserSessionService } from 'src/app/_shared/services/state/user-session.service';
import { HelpersService } from 'src/app/_shared/services/generic/helpers.service';

import { AdminModules, PlatformModules } from 'src/app/_shared/constants/general';
import { ModuleModel } from 'src/app/_shared/models/module.model';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.styl']
})
export class SidebarComponent implements OnInit {

  isOpened = true;
  menuType = 'platform';

  modules: ModuleModel[] = [];
  activeModule = null;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private helpers: HelpersService,
              private userSession: UserSessionService) {}

  ngOnInit(): void {
    this.setMenu();
    this.setActiveModule();

    this.helpers.urlChanged.subscribe(url => {
      this.setActiveModule();
    })
  }

  private setMenu(): void {
    this.menuType = this.router.url.substr(1, 5) === 'admin' ? 'admin' : 'platform';
    this.modules = this.menuType === 'admin' ? AdminModules : PlatformModules;
  }

  setModules(): boolean {
    const user = this.userSession.getUser();

    if (user.isAdmin) {
      return true;
    }

    const permissions = user.permissions;
    if (permissions === 'root') {
      return true;
    }

    const activeUnitId = 1; // todo: fix unit select logic
    const unitPermissions = permissions[activeUnitId];

    this.modules = this.modules.filter(module => {
      if (module.subModules) {
        module.subModules = module.subModules.filter(subModule => this.checkAllowedModule(unitPermissions, subModule));
        return module.subModules.length > 0;
      }

      return this.checkAllowedModule(unitPermissions, module)
    });

    return true;
  }

  checkAllowedModule(unitPermissions, module): boolean {
    if (!module.guarded) {
      return true;
    }

    return unitPermissions && unitPermissions[module.name] && unitPermissions[module.name].read;
  }

  setActiveModule(from?: string): void {
    const to = this.router.url;
    const url = this.helpers.getBaseUrl(to);

    if (from && url === this.helpers.getBaseUrl(from)) {
      return;
    }

    if (this.activeModule) {
      this.activeModule = null;
    }

    if (!url) {
      this.activeModule = this.modules[0].name;
      return;
    }

    const activeModule = this.modules.find(module => module.name === url);
    if (activeModule) {
      this.activeModule = activeModule.name;
    }
  }

  logout(): void {
    this.userSession.unsetUser();
    this.router.navigate(['/']);
  }
}
