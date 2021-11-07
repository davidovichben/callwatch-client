import { Component, Output, EventEmitter, OnInit, OnDestroy, HostBinding } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { UserSessionService } from 'src/app/_shared/services/state/user-session.service';
import { HelpersService } from 'src/app/_shared/services/generic/helpers.service';
import { LocaleService } from 'src/app/_shared/services/state/locale.service';

import { AdminModules, PlatformModules } from 'src/app/_shared/constants/modules';
import { ModuleModel } from 'src/app/_shared/models/module.model';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.styl']
})
export class SidebarComponent implements OnInit, OnDestroy {

  @HostBinding('class') toggleState = 'opened';

  @Output() toggled = new EventEmitter();

  readonly sub = new Subscription();

  menuType = 'platform';

  modules = [];
  activeModule = null;
  activeSubModule = null;

  pageDirection: 'rtl' | 'ltr';

  constructor(private router: Router,
              private route: ActivatedRoute,
              private helpers: HelpersService,
              private userSession: UserSessionService,
              private localeService: LocaleService) {}

  ngOnInit(): void {
    this.setMenu();
    this.setActiveModule();

    this.pageDirection = this.localeService.dir;
    this.sub.add(this.localeService.localeChanged.subscribe(() => {
      this.pageDirection = this.localeService.dir;
    }));

    this.sub.add(this.helpers.urlChanged.subscribe(() => {
      this.setActiveModule();
    }));
  }

  private setMenu(): void {
    this.menuType = this.router.url.substr(1, 5) === 'admin' ? 'admin' : 'platform';
    this.modules = this.menuType === 'admin' ? AdminModules : PlatformModules;

    this.setModules();
  }

  private setModules(): void {
    const user = this.userSession.getUser();

    const permissions = user.permissions;
    if (permissions === 'root') {
      return;
    }

    this.modules = this.modules.filter(module => {
      if (module.subModules && !module.isGuarded) {
        module.subModules = module.subModules.filter(subModule => this.checkAllowedModule(permissions, subModule));
        return module.subModules.length > 0;
      }

      return this.checkAllowedModule(permissions, module);
    });
  }

  private checkAllowedModule(permissions: any, module: ModuleModel): boolean {
    if (!module.isGuarded) {
      return true;
    }

    return permissions[module.name] && permissions[module.name].read;
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

    this.activeSubModule = null;

    this.findActiveModule(this.modules, url);
  }

  private findActiveModule(modules: ModuleModel[], url: string, parent?: ModuleModel): void {
    modules.forEach(module => {
      if (module.subModules) {
        this.findActiveModule(module.subModules, url, module);
      }

      if (module.name === url) {
        this.activeModule = module.name;
        if (parent) {
          this.activeModule = parent.name;
          this.activeSubModule = module.name;
        }
        if (parent) {
          parent.isToggled = true;
        }
      }
    });
  }

  toggleSubModules(module: ModuleModel): void {
    if (this.toggleState === 'closed') {
      this.toggleState = 'opened';
      this.toggled.emit(this.toggleState);
    }

    module.isToggled = !module.isToggled;
  }

  toggleSidebar(): void {
    this.modules.forEach(module => module.isToggled = false);

    this.toggleState = (this.toggleState === 'opened') ? 'closed' : 'opened';
    this.toggled.emit(this.toggleState);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
