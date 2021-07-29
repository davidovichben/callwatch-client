import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { UserSessionService } from 'src/app/_shared/services/state/user-session.service';
import { HelpersService } from 'src/app/_shared/services/generic/helpers.service';

import { UserModel } from 'src/app/_shared/models/user.model';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.styl']
})
export class ContentComponent implements OnInit {

  readonly sub = new Subscription();

  pageData: any = {};

  user: UserModel;
  isAdminViewing = false;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private userSession: UserSessionService,
              private helpers: HelpersService) {}

  ngOnInit(): void {
    this.user = this.userSession.getUser();

    this.checkAdminViewing();
    this.setPageData();

    this.helpers.urlChanged.subscribe(() => {
      this.checkAdminViewing();
      this.setPageData();
    })
  }

  private setPageData(): void {
    let component = this.route.firstChild;
    while (component.firstChild) {
      component = component.firstChild;
    }

    this.pageData = component.snapshot.data;
  }

  checkAdminViewing(): void {
    this.isAdminViewing = this.router.url.substr(1, 8) === 'platform' && this.user.isAdmin;
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
