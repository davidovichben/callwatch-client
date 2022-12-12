import { Component, Input, OnDestroy, OnInit, HostBinding } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { fromEvent, merge, Observable, Subscription, timer } from 'rxjs';
import { filter, startWith, switchMap } from 'rxjs/operators';

import { UserSessionService } from 'src/app/_shared/services/state/user-session.service';
import { LocaleService } from 'src/app/_shared/services/state/locale.service';
import { AppHttpService } from 'src/app/_shared/services/http/app-http.service';
import { AppStateService } from 'src/app/_shared/services/state/app-state.service';

import { UserModel } from 'src/app/_shared/models/user.model';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.styl']
})
export class ContentComponent implements OnInit, OnDestroy {

  @Input() @HostBinding('class') sidebarToggleState = 'opened';

  readonly sub = new Subscription();

  noPadding = false;

  user: UserModel;
  isAdminViewing = false;

  navigation: Observable<any>;

  constructor(private router: Router, private route: ActivatedRoute,
              private userSession: UserSessionService, private appHttp: AppHttpService,
              public locale: LocaleService, private appState: AppStateService) {
    this.navigation = this.router.events.pipe(filter(e => e instanceof NavigationEnd))
  }

  ngOnInit(): void {
    this.user = this.userSession.getUser();

    this.checkAdminViewing();
    this.setPadding();

    this.sub.add(this.appState.urlChanged.subscribe(() => {
      this.checkAdminViewing();
      this.setPadding();
    }));

    this.sub.add(this.userSession.userUpdated.subscribe(() => {
      this.user = this.userSession.getUser();
    }));

    this.autoLogoutTimer();
  }

  private setPadding(): void {
    this.noPadding = false;

    let component = this.route.firstChild;
    while (component.firstChild) {
      component = component.firstChild;
      if (component.snapshot.data.noPadding) {
        this.noPadding = true;
      }
    }
  }

  checkAdminViewing(): void {
    this.isAdminViewing = this.router.url.substr(1, 8) === 'platform' && this.user.isAdmin;
  }

  autoLogoutTimer(): void {
    const mouseMove = fromEvent<MouseEvent>(document, 'mousemove');
    const keyPress = fromEvent<KeyboardEvent>(document, 'keyup');
    const movementEvents = merge(keyPress, mouseMove);
    const interval = timer(600000);

    const timerSub = movementEvents.pipe(
        startWith('initial'),
        switchMap(() => {
          return interval;
        })
      ).subscribe(() => {
        const isDashBoardView = this.router.url.split('/')[2] === 'dashboard';
        if (!isDashBoardView) {
          this.logout();
        }
    });

    this.sub.add(timerSub);
  }

  logout(): void {
    let logout = true;
    this.router.navigate(['/']);

    const navigationEnd = this.navigation.subscribe(() => {
      if (logout) {
        this.router.navigate(['/']);

        this.appHttp.logout();
        this.userSession.unsetUser();
      }
    })

    this.sub.add(navigationEnd)
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
