import { Component, Output, EventEmitter, OnInit, OnDestroy, HostBinding } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { UserSessionService } from 'src/app/_shared/services/state/user-session.service';
import { HelpersService } from 'src/app/_shared/services/generic/helpers.service';
import { LocaleService } from 'src/app/_shared/services/state/locale.service';
import { AppStateService } from 'src/app/_shared/services/state/app-state.service';

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

  constructor(private router: Router, private route: ActivatedRoute,
              private helpers: HelpersService, private appState: AppStateService,
              private userSession: UserSessionService, private localeService: LocaleService) {}

  ngOnInit(): void {
    this.setMenu();
    this.setActiveModule();

    this.pageDirection = this.localeService.dir;
    this.sub.add(this.localeService.localeChanged.subscribe(() => {
      this.pageDirection = this.localeService.dir;
    }));

    this.sub.add(this.appState.urlChanged.subscribe(() => {
      this.setActiveModule();
    }));
  }

  private setMenu(): void {
    this.menuType = this.router.url.substr(1, 5) === 'admin' ? 'admin' : 'platform';
    this.modules = this.menuType === 'admin' ? AdminModules : PlatformModules;

    if (this.menuType === 'platform') {
      this.setModules();
    }
  }

  private setModules(): void {
    const user = this.userSession.getUser();

    const permissions = user.permissions;
    if (permissions === 'root') {
      return;
    }

    this.modules = this.modules.filter(module => {
      if (module.subModules && module.isOpen) {
        module.subModules = module.subModules.filter(subModule => this.checkAllowedModule(permissions, subModule));
        return module.subModules.length > 0;
      }

      return this.checkAllowedModule(permissions, module);
    });
  }

  private checkAllowedModule(permissions: any, module: ModuleModel): boolean {
    if (module.isOpen) {
      return true;
    }

    return permissions[module.permission] && permissions[module.permission].read;
  }

  setActiveModule(from?: string): void {
    const to = this.router.url;
    const url = this.helpers.getUrlSegment(to, this.menuType.length + 2);

    if (from && url === this.helpers.getUrlSegment(from, this.menuType.length + 2)) {
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

  private findActiveModule(modules: ModuleModel[], url: string): void {
    this.activeModule = modules.find(module => url === module.name);

    if (this.activeModule?.subModules) {
      this.activeModule.isToggled = true;

      const from = this.router.url.indexOf(this.activeModule.name) + this.activeModule.name.length + 1;
      const subUrl = this.helpers.getUrlSegment(this.router.url, from);

      this.activeSubModule = this.activeModule.subModules.find(subModule => subUrl === subModule.name);
    }
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
