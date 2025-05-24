import { Component, Output, EventEmitter, OnInit, OnDestroy, HostBinding, Input } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { NgClass, NgForOf, NgIf, NgStyle } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { fromEvent, merge, Observable, Subscription, timer } from 'rxjs';
import { filter, startWith, switchMap } from 'rxjs/operators';

import { TranslateModule } from '../../../pipes/translate/translate.module';

import { UserSessionService } from 'src/app/_shared/services/state/user-session.service';
import { HelpersService } from 'src/app/_shared/services/generic/helpers.service';
import { LocaleService } from 'src/app/_shared/services/state/locale.service';
import { AppStateService } from 'src/app/_shared/services/state/app-state.service';
import { AppHttpService } from '../../../services/http/app-http.service';

import { ModuleModel } from 'src/app/_shared/models/module.model';
import { UserModel } from '../../../models/user.model';

import { AdminModules, PlatformModules } from 'src/app/_shared/constants/modules';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.sass'],
  imports: [
    NgClass,
    NgIf,
    RouterLink,
    NgForOf,
    MatIcon,
    TranslateModule,
    NgStyle
  ],
  providers: [AppHttpService],
  standalone: true
})
export class SidebarComponent implements OnInit, OnDestroy {
  @HostBinding('class') toggleState = 'opened';

  @Input() unreadNotificationsCount = 0;
  @Output() toggled = new EventEmitter();

  readonly sub = new Subscription();

  menuType = 'platform';

  modules = [];
  activeModule = null;
  activeSubModule = null;

  pageDirection: 'rtl' | 'ltr';
  
  isAdminViewing = false;
  
  user: UserModel;
  
  navigation: Observable<any>;
  
  constructor(private router: Router, private helpers: HelpersService,
              private appState: AppStateService, private userSession: UserSessionService,
              public locale: LocaleService, private appHttp: AppHttpService) {
    this.navigation = this.router.events.pipe(filter(e => e instanceof NavigationEnd))
  }
  
  ngOnInit(): void {
    this.setMenu();
    this.setActiveModule();

    this.pageDirection = this.locale.dir;
    this.sub.add(this.locale.localeChanged.subscribe(() => {
      this.pageDirection = this.locale.dir;
    }));

    this.sub.add(this.appState.urlChanged.subscribe(() => {
      this.setActiveModule();
    }));
    
    this.user = this.userSession.getUser();
    
    this.sub.add(this.userSession.userUpdated.subscribe(() => {
      this.user = this.userSession.getUser();
    }));
    
    this.setAdminViewing();
    this.sub.add(this.appState.urlChanged.subscribe(() => this.setAdminViewing()));
    
    this.autoLogoutTimer();
  }
  
  private setMenu(): void {
    this.menuType = this.router.url.substr(1, 5) === 'admin' ? 'admin' : 'platform';
    const modules = this.menuType === 'admin' ? [...AdminModules] : [...PlatformModules];
    this.modules = JSON.parse(JSON.stringify(modules));

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
      if (module.subModules) {
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
    
    return permissions[module.permission]?.read;
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
  
  setAdminViewing(): void {
    this.isAdminViewing = this.router.url.substr(1, 8) === 'platform' && this.user.isAdmin;
  }
  
  autoLogoutTimer(): void {
    // const mouseMove = fromEvent<MouseEvent>(document, 'mousemove');
    // const keyPress = fromEvent<KeyboardEvent>(document, 'keyup');
    // const movementEvents = merge(keyPress, mouseMove);
    // const interval = timer(600000);
    //
    // const timerSub = movementEvents.pipe(
    //   startWith('initial'),
    //   switchMap(() => {
    //     return interval;
    //   })
    // ).subscribe(() => {
    //   const isDashBoardView = this.router.url.split('/')[2] === 'dashboard';
    //   if (!isDashBoardView) {
    //     this.logout();
    //   }
    // });
    //
    // this.sub.add(timerSub);
  }
  
  logout(): void {
    // let logout = true;
    this.userSession.unsetUser();
    this.router.navigate(['/']);
    
    // const navigationEnd = this.navigation.subscribe(() => {
    //   if (logout) {
    //     this.router.navigate(['/']);
    //
    //     this.appHttp.logout();
    //     this.userSession.unsetUser();
    //   }
    // })
    //
    // this.sub.add(navigationEnd);
  }
  
  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
