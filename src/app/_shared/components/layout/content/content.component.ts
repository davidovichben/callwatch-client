import { Component, Input, OnDestroy, OnInit, HostBinding } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { UserSessionService } from 'src/app/_shared/services/state/user-session.service';
import { HelpersService } from 'src/app/_shared/services/generic/helpers.service';
import { AppHttpService } from 'src/app/_shared/services/http/app-http.service';

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

  constructor(private router: Router, private route: ActivatedRoute,
              private userSession: UserSessionService, private appHttp: AppHttpService,
              private helpers: HelpersService) {}

  ngOnInit(): void {
    this.user = this.userSession.getUser();

    this.checkAdminViewing();
    this.setPadding();

    this.sub.add(this.helpers.urlChanged.subscribe(() => {
      this.checkAdminViewing();
      this.setPadding();
    }));

    this.sub.add(this.userSession.userUpdated.subscribe(() => {
      this.user = this.userSession.getUser();
    }));
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

  logout(): void {
    this.appHttp.logout();

    this.userSession.unsetUser();
    this.router.navigate(['/']);
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
